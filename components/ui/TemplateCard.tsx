'use client';

import { Template } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import InvitationCanvas from './InvitationCanvas';

interface TemplateCardProps {
  template: Template;
  index?: number;
}

/**
 * TemplateCard - 範本卡片元件
 * 顯示範本縮圖、名稱和描述
 */
export default function TemplateCard({ template, index = 0 }: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/templates/${template.id}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* 範本預覽 */}
          <div className="relative aspect-[9/16] bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="transform scale-[0.4] origin-center">
                <InvitationCanvas
                  elements={template.elements}
                  canvasSize={template.canvasSize}
                  scale={1}
                />
              </div>
            </div>
            
            {/* Hover 覆蓋層 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="px-6 py-3 bg-white rounded-lg shadow-lg font-medium text-primary">
                  查看詳情
                </div>
              </motion.div>
            </div>
          </div>

          {/* 範本資訊 */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {template.description}
            </p>
            
            {/* 元件數量標籤 */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {template.elements.length} 個元件
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                {template.canvasSize.width} × {template.canvasSize.height}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
