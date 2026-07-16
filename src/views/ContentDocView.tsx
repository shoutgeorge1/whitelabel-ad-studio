import { ContentDoc } from '../components/ContentDoc';
import { useConcepts } from '../context/ConceptsContext';
import './ContentDocView.css';

export function ContentDocView() {
  const { concepts, resetAll } = useConcepts();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="content-doc-view">
      <div className="content-doc-view__toolbar no-print">
        <div>
          <h2>Submission doc</h2>
          <p>
            {concepts.length} static concepts · review copy, export PNGs, submit to Meta
          </p>
        </div>
        <div className="content-doc-view__actions">
          <button type="button" className="btn btn-ghost" onClick={resetAll}>
            Reset copy
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            Print / PDF
          </button>
        </div>
      </div>

      <ContentDoc concepts={concepts} />
    </div>
  );
}
