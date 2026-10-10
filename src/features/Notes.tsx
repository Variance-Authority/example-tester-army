import { useState, type FormEvent } from 'react';

export function Notes() {
  const [draft, setDraft] = useState('');
  const [notes, setNotes] = useState<string[]>([]);

  function add(event: FormEvent) {
    event.preventDefault();
    const value = draft.trim();
    if (value === '') return;
    setNotes([...notes, value]);
    setDraft('');
  }

  function remove(index: number) {
    setNotes(notes.filter((_, at) => at !== index));
  }

  return (
    <>
      <h1 className="title">Notes</h1>
      <p className="lede">Write a note, keep it, or remove it.</p>

      <form className="form" onSubmit={add}>
        <label className="label" htmlFor="note">
          Note
        </label>
        <div className="row">
          <input
            id="note"
            className="field"
            autoComplete="off"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button className="button" type="submit">
            Add note
          </button>
        </div>
      </form>
      {notes.length === 0 ? (
        <p className="lede">No notes yet.</p>
      ) : (
        <ul aria-label="Notes">
          {notes.map((note, index) => (
            <li key={`${index}-${note}`}>
              {note}{' '}
              <button className="button" type="button" onClick={() => remove(index)}>
                Remove {note}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
