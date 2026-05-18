"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge, MarkerType, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { PromptNode } from '@/components/nodes/PromptNode';
import { StyleNode } from '@/components/nodes/StyleNode';
import { RatioNode } from '@/components/nodes/RatioNode';
import { ResolutionNode } from '@/components/nodes/ResolutionNode';
import { OutputNode } from '@/components/nodes/OutputNode';
import { CanvasNode } from '@/components/nodes/CanvasNode';

import type { StyleEntry } from '@/components/StyleAddModal';

const STORAGE_KEY = "brandgen_state"; // canonical key

const initialEdges = [
  { 
    id: 'e-prompt-output', 
    source: 'prompt-node', 
    sourceHandle: 'prompt-out',
    target: 'output-node', 
    targetHandle: 'general-in', 
    style: { stroke: 'var(--port-prompt)', strokeWidth: 3 },
  },
  { 
    id: 'e-style-output', 
    source: 'style-node', 
    sourceHandle: 'style-out',
    target: 'output-node', 
    targetHandle: 'general-in', 
    style: { stroke: 'var(--port-style)', strokeWidth: 3 },
  },
  { 
    id: 'e-ratio-output', 
    source: 'ratio-node', 
    sourceHandle: 'ratio-out',
    target: 'output-node', 
    targetHandle: 'general-in', 
    style: { stroke: 'var(--port-ratio)', strokeWidth: 3 },
  },
  { 
    id: 'e-resolution-output', 
    source: 'resolution-node', 
    sourceHandle: 'resolution-out',
    target: 'output-node', 
    targetHandle: 'general-in', 
    style: { stroke: 'var(--port-resolution)', strokeWidth: 3 },
  },
];

export default function Home() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}

function FlowContent() {
  const [theme, setTheme] = useState<"light" | "dark">("dark"); // Default dark mode for pipeline UI
  const [prompt, setPrompt] = useState("");
  const [styles, setStyles] = useState<StyleEntry[]>([]);
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null);
  const [ratio, setRatio] = useState("1:1");
  const [resolution, setResolution] = useState("HD");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [englishPrompt, setEnglishPrompt] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [nodes, setNodes] = useState<any[]>([
    {
      id: 'prompt-node',
      type: 'promptNode',
      position: { x: 50, y: 50 },
      data: { prompt: "", onChange: setPrompt },
    },
    {
      id: 'style-node',
      type: 'styleNode',
      position: { x: 50, y: 300 },
      data: { 
        styles: [], 
        activeStyleId: null,
        setStyles, 
        setActiveStyleId,
      },
    },
    {
      id: 'ratio-node',
      type: 'ratioNode',
      position: { x: 50, y: 550 },
      data: { ratio: "1:1", setRatio },
    },
    {
      id: 'resolution-node',
      type: 'resolutionNode',
      position: { x: 50, y: 700 },
      data: { resolution: "HD", setResolution },
    },
    {
      id: 'output-node',
      type: 'outputNode',
      position: { x: 450, y: 150 },
      data: { 
        prompt: "", style: null, ratio: "1:1", resolution: "HD", 
        englishPrompt: "", isTranslating: false, 
        onGenerate: () => {}, 
        canGenerate: false,
        isGenerating: false 
      },
    }
  ]);
  const [edges, setEdges] = useState<any[]>(initialEdges);

  // Load from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.lastImageUrl) setImageUrl(saved.lastImageUrl);
      if (saved.ratio) setRatio(saved.ratio);
      if (saved.resolution) setResolution(saved.resolution);
      if (saved.theme) setTheme(saved.theme);
    } catch { /* ignore */ }
  }, []);

  // Sync theme to document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || "{}";
      const saved = JSON.parse(raw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, theme: newTheme }));
    } catch {}
  };

  // Translate prompt whenever inputs or connections change (debounced)
  useEffect(() => {
    const isPromptConnected = edges.some(e => e.target === 'output-node' && e.source === 'prompt-node');
    const isStyleConnected = edges.some(e => e.target === 'output-node' && e.source === 'style-node');
    const isRatioConnected = edges.some(e => e.target === 'output-node' && e.source === 'ratio-node');
    const isResConnected = edges.some(e => e.target === 'output-node' && e.source === 'resolution-node');

    if (!isPromptConnected && !isStyleConnected && !isRatioConnected && !isResConnected) {
      setEnglishPrompt("");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const activeStyle = styles.find(s => s.id === activeStyleId);  
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: isPromptConnected ? prompt : "", 
            style: isStyleConnected ? (activeStyle?.prompt || null) : null, 
            ratio: isRatioConnected ? ratio : null, 
            resolution: isResConnected ? resolution : null 
          }),
          signal: controller.signal
        });
        const data = await res.json();
        if (data.englishPrompt) {
          setEnglishPrompt(data.englishPrompt);
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error(e);
        }
      } finally {
        setIsTranslating(false);
      }
    }, 1000); // 1s debounce

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [prompt, activeStyleId, styles, ratio, resolution, edges]);

  const handleGenerate = useCallback(async () => {
    const isPromptConnected = edges.some(e => e.target === 'output-node' && e.source === 'prompt-node');
    const isStyleConnected = edges.some(e => e.target === 'output-node' && e.source === 'style-node');
    const isRatioConnected = edges.some(e => e.target === 'output-node' && e.source === 'ratio-node');
    const isResConnected = edges.some(e => e.target === 'output-node' && e.source === 'resolution-node');

    const effectivePrompt = isPromptConnected ? prompt : "";
    const activeStyle = isStyleConnected ? styles.find(s => s.id === activeStyleId) : null;

    if ((!effectivePrompt.trim() && !activeStyle) || isGenerating) return;
    setIsGenerating(true);
    setError(false);
    
    // ... rest of the function using effectivePrompt and effectiveStyle ...
    // (I will keep the rest as is but use the variables)
    
    // Add Canvas Node dynamically if it doesn't exist
    setNodes(nds => {
      const hasCanvas = nds.some(n => n.id === 'canvas-node');
      if (!hasCanvas) {
        return [...nds, {
          id: 'canvas-node',
          type: 'canvasNode',
          position: { x: 850, y: 150 },
          data: { imageUrl: null, error: false, isGenerating: true },
        }];
      }
      return nds;
    });

    setEdges(eds => {
      const hasEdge = eds.some(e => e.id === 'e-prompt-canvas');
      if (!hasEdge) {
        return [...eds, {
          id: 'e-prompt-canvas',
          source: 'output-node',
          sourceHandle: 'output-out',
          target: 'canvas-node',
          targetHandle: 'canvas-in',
          style: { stroke: 'var(--text-primary)', strokeWidth: 3 },
          animated: true,
        }];
      }
      return eds;
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: effectivePrompt,
          style: activeStyle?.prompt || null,
          ratio,
          resolution,
          // 이미 translate API에서 생성된 영문 프롬프트 재사용 → Gemini CLI 이중 호출 방지
          prebuiltPrompt: englishPrompt || null,
        }),
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        // Save to local storage
        try {
          const raw = localStorage.getItem(STORAGE_KEY) || "{}";
          const saved = JSON.parse(raw);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
            ...saved, 
            lastImageUrl: data.url,
            ratio,
            resolution
          }));
        } catch {}
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, activeStyleId, styles, ratio, resolution, isGenerating, edges, englishPrompt]);

  const nodeTypes = useMemo(() => ({
    promptNode: PromptNode,
    styleNode: StyleNode,
    ratioNode: RatioNode,
    resolutionNode: ResolutionNode,
    outputNode: OutputNode,
    canvasNode: CanvasNode,
  }), []);


  const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params: any) => {
    let targetHandle = params.targetHandle;
    
    // Always use general-in for the merged dot on OutputNode
    if (params.target === 'output-node') {
      targetHandle = 'general-in';
    }

    // Apply color styling based on source handle
    let style = { stroke: '#94a3b8', strokeWidth: 2 }; // Default
    if (params.sourceHandle === 'prompt-out') style = { stroke: 'var(--port-prompt)', strokeWidth: 3 };
    if (params.sourceHandle === 'style-out') style = { stroke: 'var(--port-style)', strokeWidth: 3 };
    if (params.sourceHandle === 'ratio-out') style = { stroke: 'var(--port-ratio)', strokeWidth: 3 };
    if (params.sourceHandle === 'resolution-out') style = { stroke: 'var(--port-resolution)', strokeWidth: 3 };

    setEdges((eds) => {
      // Remove any existing edge from the same source node to prevent duplicates
      const filtered = eds.filter(e => !(e.source === params.source && e.target === 'output-node'));
      return addEdge({ ...params, targetHandle, style }, filtered);
    });
  }, [setEdges]);

  const finalNodes = useMemo(() => {
    return nodes.map((node) => {
      const baseData = node.data || {};
      if (node.id === 'prompt-node') {
        return { ...node, data: { ...baseData, prompt, onChange: setPrompt } };
      }
      if (node.id === 'style-node') {
        return { ...node, data: { ...baseData, styles, activeStyleId, setStyles, setActiveStyleId } };
      }
      if (node.id === 'ratio-node') {
        return { ...node, data: { ...baseData, ratio, setRatio } };
      }
      if (node.id === 'resolution-node') {
        return { ...node, data: { ...baseData, resolution, setResolution } };
      }
      if (node.id === 'output-node') {
        return { 
          ...node, 
          data: { 
            ...baseData,
            prompt, 
            ratio, 
            resolution, 
            englishPrompt, isTranslating, 
            onGenerate: handleGenerate, 
            canGenerate: (edges.some(e => e.target === 'output-node' && e.source === 'prompt-node') && !!prompt.trim()) || 
                         (edges.some(e => e.target === 'output-node' && e.source === 'style-node') && !!activeStyleId),
            isGenerating 
          } 
        };
      }
      if (node.id === 'canvas-node') {
        return {
          ...node,
          data: { ...baseData, imageUrl, error, isGenerating }
        };
      }
      return node;
    });
  }, [nodes, prompt, activeStyleId, styles, ratio, resolution, englishPrompt, isTranslating, handleGenerate, isGenerating, imageUrl, error, edges]);

  return (
    <main style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <ReactFlow
        nodes={finalNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: 'default', animated: false, style: { strokeWidth: 3 } }}
        connectionLineStyle={{ stroke: 'var(--text-tertiary)', strokeWidth: 3 }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        colorMode={theme}
      >
        <Background color="var(--border-node)" gap={24} size={1} />
      </ReactFlow>

      {/* 우상단 컨트롤 박스 (절대 위치로 간결하게 배치) */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 4, display: 'flex', alignItems: 'center', padding: '4px', backgroundColor: 'var(--bg-node-base)', borderRadius: '20px', border: '1px solid var(--border-node)', boxShadow: 'var(--shadow-node)' }}>
        <Controls 
          showInteractive={false} 
          position="top-right"
          style={{ 
            position: 'relative', 
            top: 0, 
            right: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none'
          }} 
        />
      </div>

      {/* 좌상단 브랜드 박스 (기존 유지) */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 4, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'var(--bg-node-base)', borderRadius: '20px', border: '1px solid var(--border-node)', boxShadow: 'var(--shadow-node)' }}>
        <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>BrandGen</span>
        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '100px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-canvas)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>베타</span>
        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-node)', margin: '0 4px' }} />
        <div 
          onClick={toggleTheme}
          title="Toggle Theme"
          style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: theme === 'dark' ? 'var(--port-ratio)' : 'var(--border-node)', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'var(--bg-node-base)', position: 'absolute', top: 2, left: theme === 'dark' ? 18 : 2, transition: 'left 0.2s' }} />
        </div>
      </div>
    </main>
  );
}
