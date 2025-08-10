import api from './client';

export async function listNotes() {
  const { data } = await api.get('/notes');
  return data.notes;
}

export async function getNote(id: string) {
  const { data } = await api.get(`/notes/${id}`);
  return data.note;
}

export async function uploadNote(formData: FormData) {
  const { data } = await api.post('/notes/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.note;
}

export function downloadNote(id: string) {
  window.location.href = `/api/notes/${id}/download`;
}

export async function summarizeNote(id: string, maxSentences = 5) {
  const { data } = await api.post(`/notes/${id}/summarize`, { maxSentences });
  return data.summary as string;
}

export async function quizFromNote(id: string, numQuestions = 5) {
  const { data } = await api.post(`/notes/${id}/quiz`, { numQuestions });
  return data.questions as Array<any>;
}