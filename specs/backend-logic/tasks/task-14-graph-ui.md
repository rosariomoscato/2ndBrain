# Task 14: Graph & Tags Integration

## Status

complete

## Wave

5

## Description

Wire the knowledge graph canvas and tag manager to real backend data. Replace the 3 hardcoded graph nodes/edges with real data from the graph data layer. Replace the 5 hardcoded tags in tag-manager.tsx with real tags from the server actions. Connect graph filter/search, node details panel, edge creation, and tag CRUD operations.

## Dependencies

**Depends on:** task-05-tags.md, task-06-settings.md, task-09-graph.md
**Blocks:** task-15-polish.md

**Context from dependencies:** task-05 provides `getTags()`, `createTag()`, `updateTag()`, `deleteTag()`, `bulkDeleteTags()`. task-06 provides `getSettings()`, `updateSettings()`. task-09 provides `getGraphData()`, `createEdge()`, `deleteEdge()`, `updateNodePosition()`. The graph canvas (graph-canvas.tsx) has 3 hardcoded nodes and 2 edges. The tag manager (tag-manager.tsx) has 5 hardcoded tags.

## Files to Modify

- `src/components/graph/graph-canvas.tsx` — Replace hardcoded nodes/edges with real data
- `src/components/tags/tag-manager.tsx` — Replace hardcoded tags with real data
- `src/app/settings/page.tsx` — Wire settings panel to real persistence

## Technical Details

### Implementation Steps

1. **src/components/graph/graph-canvas.tsx:**
- Add state for nodes and edges
- Load from `getGraphData()` on mount
- Wire `handleConnect` to `createEdge()` server action
- Wire node drag to `updateNodePosition()` server action
- Wire `handleFilterChange` to filter nodes client-side based on node data
- Wire `handleSearch` / `handleNodeSelect` to work with real node data
- Wire node details panel to show real node data

```typescript
const [nodes, setNodes, onNodesChange] = useNodesState([]);
const [edges, setEdges, onEdgesChange] = useEdgesState([]);

useEffect(() => {
  async function loadGraph() {
    try {
      const data = await getGraphData();
      setNodes(data.nodes);
      setEdges(data.edges);
    } catch (error) {
      console.error("Failed to load graph:", error);
    }
  }
  loadGraph();
}, []);

const onConnect = useCallback(async (connection: Connection) => {
  if (!connection.source || !connection.target) return;
  const edge = await createEdge(connection.source, connection.target);
  setEdges(eds => addEdge({
    id: edge.id,
    source: connection.source!,
    target: connection.target!,
    animated: true,
  }, eds));
}, [setEdges]);

const onNodeDragStop = useCallback(async (_: MouseEvent, node: Node) => {
  await updateNodePosition(node.id, node.position.x, node.position.y);
}, []);
```

2. **src/components/tags/tag-manager.tsx:**
- Replace `mockTags` with state loaded from `getTags()`
- Wire save to `createTag()` / `updateTag()`
- Wire delete to `deleteTag()` / `bulkDeleteTags()`
- Add sort options that call `getTags({ sortBy })` 

```typescript
const [tags, setTags] = useState<Tag[]>([]);
const [loading, setLoading] = useState(true);

async function loadTags(sortBy?: "name" | "usage" | "date") {
  setLoading(true);
  try {
    const data = await getTags({ sortBy });
    setTags(data);
  } finally {
    setLoading(false);
  }
}

useEffect(() => { loadTags(); }, []);

const handleSaveTag = async (tagData: { name: string; color: string }) => {
  if (editingTag) {
    await updateTag({ id: editingTag.id, ...tagData });
  } else {
    await createTag(tagData);
  }
  await loadTags(sortBy);
};
```

3. **src/app/settings/page.tsx:**
- Load settings from `getSettings()` on mount
- Wire each setting change to `updateSettings()` with the relevant section
- Wire theme presets to update all theme values at once

```typescript
const [settings, setSettings] = useState<{
  theme: UserThemeSettings;
  system: UserSystemSettings;
  ai: UserAISettings;
} | null>(null);

useEffect(() => {
  getSettings().then(setSettings);
}, []);

const updateTheme = async (theme: Partial<UserThemeSettings>) => {
  const updated = await updateSettings({ theme });
  setSettings(updated);
};
```

### Notes

- Graph data loading should show a loading state (empty canvas or LoadingOrb)
- Tag operations should optimistically update the UI, then sync with server response
- Settings changes should be debounced (don't save on every slider move, save on release)
- Node positions are persisted on drag end, not during drag

## Acceptance Criteria

- [ ] Graph canvas loads real nodes and edges from database
- [ ] Creating an edge (connecting nodes) persists to database
- [ ] Dragging nodes saves positions
- [ ] Graph filters work on real node data
- [ ] Graph search finds real nodes by label
- [ ] Node details panel shows real node data
- [ ] Tag manager shows real tags with usage counts
- [ ] Creating/editing/deleting tags works with database
- [ ] Bulk delete removes multiple tags
- [ ] Settings load from database and persist changes
- [ ] Theme presets update all theme values
