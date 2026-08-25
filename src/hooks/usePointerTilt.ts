import { useRef, useState } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type React from 'react';

/**
 * Inclinación 3D sutil ligada al cursor. Solo se activa con mouse
 * y se desactiva por completo si la persona pidió menos movimiento.
 */
export function usePointerTilt(maxDegrees = 5) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const spring = { stiffness: 240, damping: 26 };
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [maxDegrees, -maxDegrees]), spring);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-maxDegrees, maxDegrees]), spring);

  const reset = () => {
    setIsHovered(false);
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const tiltProps = {
    ref,
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      if (reduceMotion || event.pointerType !== 'mouse' || !ref.current) return;
      const bounds = ref.current.getBoundingClientRect();
      pointerX.set((event.clientX - bounds.left) / bounds.width);
      pointerY.set((event.clientY - bounds.top) / bounds.height);
    },
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse') setIsHovered(true);
    },
    onPointerLeave: reset
  };

  const tiltStyle = reduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' as const };

  return { tiltProps, tiltStyle, isHovered, reduceMotion };
}