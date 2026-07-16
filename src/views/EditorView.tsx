import { useNavigate, useParams } from 'react-router-dom';
import { CreativeEditor } from '../components/CreativeEditor';
import { useConcepts } from '../context/ConceptsContext';
import { exportAdToPng } from '../utils/export';
import type { ExportSize } from '../types/concept';
import './EditorView.css';

export function EditorView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById, saveConcept, duplicateConceptById } = useConcepts();

  const concept = id ? getById(id) : undefined;

  if (!concept) {
    return (
      <div className="editor-view editor-view--missing">
        <h2>Concept not found</h2>
        <p>The concept &ldquo;{id}&rdquo; does not exist.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleDuplicate = () => {
    const copy = duplicateConceptById(concept.concept_id);
    if (copy) {
      navigate(`/editor/${copy.concept_id}`);
    }
  };

  const handleExport = async (size: ExportSize, element: HTMLElement) => {
    await exportAdToPng(element, concept.file_name, size);
  };

  return (
    <div className="editor-view">
      <div className="editor-view__top">
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <span className="editor-view__file-name">{concept.file_name}</span>
      </div>
      <CreativeEditor
        concept={concept}
        onSave={saveConcept}
        onDuplicate={handleDuplicate}
        onExport={handleExport}
      />
    </div>
  );
}
