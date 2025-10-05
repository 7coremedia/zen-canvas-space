import { type ProjectDetails } from "@/components/smart-blocks/ProjectInfoOverlay";

type Props = {
  details: ProjectDetails;
  isEditable: boolean;
};

/**
 * A card that displays structured project information and notes.
 * It can be in a read-only or editable state.
 */
export default function ProjectInfoCard({ details, isEditable }: Props) {
  const hasNotes = details.notes && (!Array.isArray(details.notes) || details.notes.length > 0);

  const renderDetailItem = (label: string, value?: string) => {
    if (!value) return null;
    return (
      <div>
        <h4 className="font-medium text-xs uppercase tracking-wider text-neutral-600">
          {label}
        </h4>
        <p className="text-sm text-neutral-900">{value}</p>
      </div>
    );
  };

  return (
    <div className="bg-white/50 max-h-[70vh] overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Structured Details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          {renderDetailItem("Client", details.client)}
          {renderDetailItem("Industry", details.industry)}
          {renderDetailItem("Location", details.location)}
          {renderDetailItem("Our Role", details.our_role)}
        </div>

        {details.the_challenge && (
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900">The Challenge</h3>
            <p className="text-sm text-neutral-800 leading-relaxed">
              {details.the_challenge}
            </p>
          </div>
        )}

        {details.the_solution && (
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900">The Solution</h3>
            <p className="text-sm text-neutral-800 leading-relaxed">
              {details.the_solution}
            </p>
          </div>
        )}

        {/* Notes Section */}
        {hasNotes && (
          <div className="space-y-3 pt-4 border-t border-black/10">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-neutral-900">Project Notes</h3>
            </div>

            {isEditable ? (
              <div className="prose prose-sm max-w-none p-3 rounded-md border border-neutral-200 bg-white min-h-[200px]">
                {/*
                  This is where your rich-text editor (e.g., BlockNote, Tiptap) would be rendered.
                  For now, it's a placeholder. You would pass the 'details.notes' content
                  to the editor and have an 'onChange' handler to update the state.
                */}
                <p className="text-neutral-500">
                  Rich text editor for notes goes here. You can integrate your existing 'blocseditor' or 'docs editor' component.
                </p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-neutral-800 leading-relaxed">
                {/*
                  This would render the saved rich-text content.
                  For now, we'll just stringify the JSON if it's an object.
                */}
                {typeof details.notes === "object" ? (
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(details.notes, null, 2)}
                  </pre>
                ) : (
                  <p>{String(details.notes)}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}