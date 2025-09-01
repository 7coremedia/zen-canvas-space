import { supabase } from '../supabaseClient';
import { SystemPrompt, SystemPromptCreate, SystemPromptUpdate, SystemPromptResponse } from '@/types/systemPrompt';

export class SystemPromptService {
  /**
   * Get the currently active system prompt
   */
  static async getActivePrompt(): Promise<SystemPromptResponse> {
    try {
      const { data, error } = await supabase
        .from('system_prompts')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching active system prompt:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'No active system prompt found'
        };
      }

      return {
        success: true,
        data: data as SystemPrompt
      };
    } catch (error) {
      console.error('Unexpected error in getActivePrompt:', error);
      return {
        success: false,
        error: 'Failed to fetch active system prompt'
      };
    }
  }

  /**
   * Create or update a system prompt
   */
  static async updatePrompt(prompt: SystemPromptCreate): Promise<SystemPromptResponse> {
    try {
      // Use upsert to insert or update
      const { data, error } = await supabase
        .from('system_prompts')
        .upsert({
          version: prompt.version,
          content: prompt.content,
          description: prompt.description,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'version'
        });

      if (error) {
        console.error('Error updating system prompt:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Fetch the updated prompt
      const { data: promptData, error: fetchError } = await supabase
        .from('system_prompts')
        .select('*')
        .eq('version', prompt.version)
        .single();

      if (fetchError) {
        console.error('Error fetching updated prompt:', fetchError);
        return {
          success: false,
          error: fetchError.message
        };
      }

      return {
        success: true,
        data: promptData as SystemPrompt
      };
    } catch (error) {
      console.error('Unexpected error in updatePrompt:', error);
      return {
        success: false,
        error: 'Failed to update system prompt'
      };
    }
  }

  /**
   * Activate a specific prompt version
   */
  static async activatePromptVersion(version: string): Promise<SystemPromptResponse> {
    try {
      // First, deactivate all prompts
      const { error: deactivateError } = await supabase
        .from('system_prompts')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('is_active', true);

      if (deactivateError) {
        console.error('Error deactivating prompts:', deactivateError);
        return {
          success: false,
          error: deactivateError.message
        };
      }

      // Then activate the specified version
      const { error: activateError } = await supabase
        .from('system_prompts')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('version', version);

      if (activateError) {
        console.error('Error activating prompt version:', activateError);
        return {
          success: false,
          error: activateError.message
        };
      }

      // Fetch the activated prompt
      const { data: promptData, error: fetchError } = await supabase
        .from('system_prompts')
        .select('*')
        .eq('version', version)
        .single();

      if (fetchError) {
        console.error('Error fetching activated prompt:', fetchError);
        return {
          success: false,
          error: fetchError.message
        };
      }

      return {
        success: true,
        data: promptData as SystemPrompt
      };
    } catch (error) {
      console.error('Unexpected error in activatePromptVersion:', error);
      return {
        success: false,
        error: 'Failed to activate prompt version'
      };
    }
  }

  /**
   * Get prompt history
   */
  static async getPromptHistory(): Promise<SystemPromptResponse> {
    try {
      const { data, error } = await supabase
        .from('system_prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompt history:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data as SystemPrompt[]
      };
    } catch (error) {
      console.error('Unexpected error in getPromptHistory:', error);
      return {
        success: false,
        error: 'Failed to fetch prompt history'
      };
    }
  }

  /**
   * Delete a prompt version (only if not active)
   */
  static async deletePromptVersion(version: string): Promise<SystemPromptResponse> {
    try {
      // Check if the prompt is active
      const { data: activePrompt, error: checkError } = await supabase
        .from('system_prompts')
        .select('is_active')
        .eq('version', version)
        .single();

      if (checkError) {
        console.error('Error checking prompt status:', checkError);
        return {
          success: false,
          error: checkError.message
        };
      }

      if (activePrompt.is_active) {
        return {
          success: false,
          error: 'Cannot delete active prompt version'
        };
      }

      // Delete the prompt
      const { error: deleteError } = await supabase
        .from('system_prompts')
        .delete()
        .eq('version', version);

      if (deleteError) {
        console.error('Error deleting prompt version:', deleteError);
        return {
          success: false,
          error: deleteError.message
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Unexpected error in deletePromptVersion:', error);
      return {
        success: false,
        error: 'Failed to delete prompt version'
      };
    }
  }
}
