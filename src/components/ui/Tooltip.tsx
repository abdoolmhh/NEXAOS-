import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = ({ children, content, side = 'top', align = 'center' }: TooltipProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen} delayDuration={200}>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <TooltipPrimitive.Portal forceMount>
            <TooltipPrimitive.Content
              side={side}
              align={align}
              sideOffset={8}
              asChild
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: side === 'top' ? 4 : -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: side === 'top' ? 4 : -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="z-[1000] px-3 py-1.5 bg-text-primary text-white text-xs font-bold rounded-lg shadow-xl border border-white/10 max-w-xs text-center"
              >
                {content}
                <TooltipPrimitive.Arrow className="fill-text-primary" />
              </motion.div>
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        )}
      </AnimatePresence>
    </TooltipPrimitive.Root>
  );
};
