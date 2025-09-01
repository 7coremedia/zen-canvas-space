-- Create database functions for system prompt management

-- Function to get the currently active system prompt
CREATE OR REPLACE FUNCTION get_active_system_prompt()
RETURNS TABLE(
    id INTEGER,
    version VARCHAR(50),
    content TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(100),
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.id,
        sp.version,
        sp.content,
        sp.is_active,
        sp.created_at,
        sp.created_by,
        sp.description
    FROM system_prompts sp
    WHERE sp.is_active = TRUE
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update or create a new system prompt version
CREATE OR REPLACE FUNCTION update_system_prompt(
    p_version VARCHAR(50),
    p_content TEXT,
    p_description TEXT DEFAULT NULL,
    p_created_by VARCHAR(100) DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_id INTEGER;
BEGIN
    -- Insert new version
    INSERT INTO system_prompts (version, content, description, created_by)
    VALUES (p_version, p_content, p_description, p_created_by)
    RETURNING id INTO v_id;
    
    RETURN v_id;
EXCEPTION
    WHEN unique_violation THEN
        -- Version already exists, update it
        UPDATE system_prompts 
        SET content = p_content, 
            description = COALESCE(p_description, description),
            created_by = COALESCE(p_created_by, created_by),
            created_at = CURRENT_TIMESTAMP
        WHERE version = p_version
        RETURNING id INTO v_id;
        
        RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to activate a specific prompt version
CREATE OR REPLACE FUNCTION activate_prompt_version(p_version VARCHAR(50))
RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Check if version exists
    SELECT EXISTS(SELECT 1 FROM system_prompts WHERE version = p_version) INTO v_exists;
    
    IF NOT v_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Deactivate all prompts
    UPDATE system_prompts SET is_active = FALSE;
    
    -- Activate the specified version
    UPDATE system_prompts SET is_active = TRUE WHERE version = p_version;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get prompt history
CREATE OR REPLACE FUNCTION get_prompt_history()
RETURNS TABLE(
    id INTEGER,
    version VARCHAR(50),
    content TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(100),
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.id,
        sp.version,
        sp.content,
        sp.is_active,
        sp.created_at,
        sp.created_by,
        sp.description
    FROM system_prompts sp
    ORDER BY sp.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a prompt version (only if not active)
CREATE OR REPLACE FUNCTION delete_prompt_version(p_version VARCHAR(50))
RETURNS BOOLEAN AS $$
DECLARE
    v_is_active BOOLEAN;
BEGIN
    -- Check if version is active
    SELECT is_active INTO v_is_active FROM system_prompts WHERE version = p_version;
    
    IF v_is_active THEN
        RETURN FALSE; -- Cannot delete active prompt
    END IF;
    
    -- Delete the version
    DELETE FROM system_prompts WHERE version = p_version;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_active_system_prompt() TO authenticated;
GRANT EXECUTE ON FUNCTION update_system_prompt(VARCHAR, TEXT, TEXT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION activate_prompt_version(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION get_prompt_history() TO authenticated;
GRANT EXECUTE ON FUNCTION delete_prompt_version(VARCHAR) TO authenticated;

-- Grant table permissions
GRANT SELECT ON system_prompts TO authenticated;
GRANT INSERT, UPDATE ON system_prompts TO authenticated;
