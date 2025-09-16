"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const codeSnippet = `
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Genius APPio Demo',
      theme: ThemeData(
        primarySwatch: Colors.green,
        brightness: Brightness.dark,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Code Gen'),
      ),
      body: Center(
        child: Text(
          'AI is building...',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ),
    );
  }
}
`.trim();

const lines = codeSnippet.split('\n');

export function AnimatedCode() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    setVisibleLines(0);
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= lines.length) {
          // Pause at the end for a bit, then restart
          setTimeout(() => setVisibleLines(0), 2000);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 80); // Speed of line appearance

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#282c34] rounded-lg shadow-2xl overflow-hidden h-[450px] font-code border border-green-500/20">
      <div className="flex items-center justify-between p-3 bg-gray-800/50 border-b border-green-500/20">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
        </div>
        <div className="text-sm text-gray-400">
          lib/main.dart
        </div>
      </div>
      <div className="p-4 text-sm overflow-auto h-full">
        <pre>
          <AnimatePresence>
            {lines.slice(0, visibleLines).map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="block"
                dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }}
              />
            ))}
          </AnimatePresence>
          <motion.div 
            className="w-2 h-4 bg-green-400 inline-block animate-pulse"
            style={{ display: visibleLines >= lines.length ? 'none' : 'inline-block' }}
          />
        </pre>
      </div>
    </div>
  );
}

function syntaxHighlight(str: string): string {
    str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Keywords
    str = str.replace(/\b(import|void|runApp|const|class|extends|super|key|@override|Widget|build|return|new|final|var|if|else|for|while)\b/g, '<span class="text-purple-400">$1</span>');
    
    // Built-in types and classes
    str = str.replace(/\b(MaterialApp|ThemeData|Scaffold|AppBar|Center|Text|BuildContext|StatelessWidget|Colors|Brightness|Theme|headlineMedium)\b/g, '<span class="text-yellow-400">$1</span>');

    // Strings
    str = str.replace(/('.*?')/g, '<span class="text-green-400">$1</span>');
    
    // Numbers
    str = str.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');

    // Comments
    str = str.replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>');

    // Properties
    str = str.replace(/(\w+)(?=:)/g, '<span class="text-cyan-400">$1</span>');

    return str;
}
