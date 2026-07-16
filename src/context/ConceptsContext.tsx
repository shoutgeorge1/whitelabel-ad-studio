import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Concept } from '../types/concept';
import {
  loadConcepts,
  saveConcepts,
  resetConcepts,
  updateConcept,
  duplicateConcept,
  getConceptById,
} from '../utils/concepts';

interface ConceptsContextValue {
  concepts: Concept[];
  saveConcept: (concept: Concept) => void;
  duplicateConceptById: (id: string) => Concept | undefined;
  resetAll: () => void;
  getById: (id: string) => Concept | undefined;
}

const ConceptsContext = createContext<ConceptsContextValue | null>(null);

export function ConceptsProvider({ children }: { children: ReactNode }) {
  const [concepts, setConcepts] = useState<Concept[]>(() => loadConcepts());

  const saveConcept = useCallback((concept: Concept) => {
    setConcepts((prev) => {
      const next = updateConcept(prev, concept);
      saveConcepts(next);
      return next;
    });
  }, []);

  const duplicateConceptById = useCallback((id: string) => {
    let created: Concept | undefined;
    setConcepts((prev) => {
      const { concepts: next, duplicate } = duplicateConcept(prev, id);
      created = duplicate;
      return next;
    });
    return created;
  }, []);

  const resetAll = useCallback(() => {
    setConcepts(resetConcepts());
  }, []);

  const getById = useCallback(
    (id: string) => getConceptById(concepts, id),
    [concepts]
  );

  const value = useMemo(
    () => ({ concepts, saveConcept, duplicateConceptById, resetAll, getById }),
    [concepts, saveConcept, duplicateConceptById, resetAll, getById]
  );

  return (
    <ConceptsContext.Provider value={value}>{children}</ConceptsContext.Provider>
  );
}

export function useConcepts() {
  const ctx = useContext(ConceptsContext);
  if (!ctx) throw new Error('useConcepts must be used within ConceptsProvider');
  return ctx;
}
