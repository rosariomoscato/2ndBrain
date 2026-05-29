/**
 * Centralized TypeScript type definitions for the Second Brain application.
 *
 * This file serves as the single source of truth for all shared types used
 * across the application. Both server actions and UI components import types
 * from here to maintain consistency.
 */

/**
 * Available color options for tags.
 * These correspond to the neon color palette used in the cyberpunk UI.
 */
export type TagColor = "purple" | "cyan" | "blue" | "pink" | "green" | "orange";

/**
 * Type of node in the knowledge graph.
 * Each type represents a different kind of knowledge entity.
 */
export type NodeType = "note" | "concept" | "tag" | "reference";

/**
 * Tag information associated with a note.
 * This is a simplified representation used in the Note type.
 */
export type NoteTag = {
  id: string;
  name: string;
  color: TagColor;
};

/**
 * Complete note representation.
 * Used by UI components and returned from server actions.
 */
export type Note = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  tags: NoteTag[];
  updatedAt: string;
  connections: number;
  importance: number;
};

/**
 * Complete tag representation.
 * Includes usage count computed from the note_tags junction table.
 */
export type Tag = {
  id: string;
  name: string;
  color: TagColor;
  usageCount: number;
  createdAt: Date;
};

/**
 * Node data structure for the knowledge graph visualization.
 * This is what the graph-node.tsx component expects.
 */
export type NodeData = {
  label: string;
  type: NodeType;
  noteId: string | null;
  excerpt: string;
  tags: string[];
  updatedAt: string;
  createdAt?: string;
  connections: number;
  importance: number;
};

/**
 * Citation from a note in an AI response.
 * Includes relevance score (0-1) for ranking.
 */
export type Citation = {
  noteId: string;
  noteTitle: string;
  excerpt: string;
  relevance: number;
};

/**
 * Complete AI response with query, answer, and citations.
 */
export type AIResponse = {
  query: string;
  answer: string;
  citations: Citation[];
  timestamp: string;
};

/**
 * Query history item for the AI panel.
 */
export type QueryHistoryItem = {
  id: string;
  query: string;
  timestamp: string;
};

/**
 * User theme customization settings.
 * Controls visual appearance parameters.
 */
export type UserThemeSettings = {
  neonIntensity?: number;
  gridVisibility?: number;
  particleDensity?: number;
  scanLineSpeed?: number;
  preset?: "minimal" | "balanced" | "cyberpunk";
};

/**
 * User system behavior settings.
 * Controls application behavior and features.
 */
export type UserSystemSettings = {
  glassmorphism?: boolean;
  animations?: boolean;
  notifications?: boolean;
  soundEffects?: boolean;
};

/**
 * User AI integration settings.
 * Controls AI model and response preferences.
 */
export type UserAISettings = {
  model?: string;
  streamResponses?: boolean;
  includeCitations?: boolean;
  desktopNotifications?: boolean;
};

/**
 * Graph node representation from the database.
 * Maps to NodeData for the UI.
 */
export type GraphNode = {
  id: string;
  label: string;
  type: NodeType;
  noteId: string | null;
  importance: number;
  positionX: number | null;
  positionY: number | null;
  tags: string[];
  updatedAt: string;
  connections: number;
};

/**
 * Graph edge representation from the database.
 * Represents connections between nodes in the knowledge graph.
 */
export type GraphEdge = {
  id: string;
  sourceId: string;
  targetId: string;
};

/**
 * Dashboard statistics for overview display.
 * Includes trend indicators for analytics.
 */
export type DashboardStats = {
  totalNotes: number;
  totalNodes: number;
  totalConnections: number;
  notesTrend: string;
  nodesTrend: string;
  connectionsTrend: string;
};

/**
 * Recent activity item for the dashboard activity feed.
 * Tracks user actions across the application.
 */
export type RecentActivity = {
  id: string;
  action: string;
  target: string;
  time: string;
  type: "create" | "connect" | "query" | "update";
};