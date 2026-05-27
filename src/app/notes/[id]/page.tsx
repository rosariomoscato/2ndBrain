import { notFound } from "next/navigation";
import { MainViewport } from "@/components/layout/main-viewport";
import { NoteEditor } from "@/components/notes/note-editor";

// Mock notes data
const mockNotes: Record<string, { title: string; content: string; tags: string[] }> = {
  "1": {
    title: "Transformers Architecture Explained",
    content: `# Transformers Architecture

The **Transformer** architecture revolutionized natural language processing by introducing *self-attention mechanisms*.

## Key Components

- **Self-Attention**: Allows the model to weigh the importance of different words in a sentence
- **Multi-Head Attention**: Enables the model to capture different types of relationships
- **Positional Encoding**: Provides information about the order of tokens

## Code Example

\`\`\`python
import torch
import torch.nn as nn

class SelfAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super(SelfAttention, self).__init__()
        self.embed_size = embed_size
        self.heads = heads
        
    def forward(self, values, keys, query, mask):
        N = query.shape[0]
        value_len, key_len, query_len = values.shape[1], keys.shape[1], query.shape[1]
        
        # Split the embedding into self.heads pieces
        values = values.reshape(N, value_len, self.heads, self.head_dim)
        keys = keys.reshape(N, key_len, self.heads, self.head_dim)
        queries = query.reshape(N, query_len, self.heads, self.head_dim)
        
        # Einsum does matrix multiplication for query*keys for every training example
        # with every head
        energy = torch.einsum("nqhd,nkhd->nhqk", [queries, keys])
        
        return energy
\`\`\`

## Important Notes

> The transformer architecture introduced in "Attention Is All You Need" (2017) has become the foundation for most modern language models.

## Future Improvements

- [ ] Add more examples of attention mechanisms
- [ ] Include visualization of attention weights
- [ ] Add comparison with RNNs and LSTMs

## Resources

- [Original Paper](https://arxiv.org/abs/1706.03762)
- [Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)

The transformer's ability to process *all positions in parallel* makes it highly efficient for training on large datasets.`,
    tags: ["AI", "ML", "NLP", "Transformers"],
  },
};

interface NotePageProps {
  params: {
    id: string;
  };
}

export default function NotePage({ params }: NotePageProps) {
  const noteId = params.id;
  const note = mockNotes[noteId];

  if (!note) {
    notFound();
  }

  return (
    <MainViewport>
      <NoteEditor
        initialTitle={note.title}
        initialContent={note.content}
        initialTags={note.tags}
        onSave={(updatedNote) => {
          // eslint-disable-next-line no-console
          console.log("Note updated:", updatedNote);
        }}
        isReadOnly={false}
      />
    </MainViewport>
  );
}