import { useMediaQuery } from "@vueuse/core";

/**
 * 检测是否为小屏幕设备
 * @returns 是否为小屏幕（<=768px）
 */
export const useIsSmallScreen = () => {
  return useMediaQuery('(max-width: 768px)');
};

/**
 * 检测是否为中等屏幕设备
 * @returns 是否为中等屏幕（768px-1023px）
 */
export const useIsMediumScreen = () => {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
};

/**
 * 检测是否为大屏幕设备
 * @returns 是否为大屏幕（>=1024px）
 */
export const useIsLargeScreen = () => {
  return useMediaQuery('(min-width: 1024px)');
};