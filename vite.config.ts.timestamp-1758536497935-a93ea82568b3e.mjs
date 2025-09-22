// vite.config.ts
import { defineConfig } from "file:///C:/Users/Imzen/Documents/Desktop%20Safe/zen-canvas-space/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Imzen/Documents/Desktop%20Safe/zen-canvas-space/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/Imzen/Documents/Desktop%20Safe/zen-canvas-space/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Imzen\\Documents\\Desktop Safe\\zen-canvas-space";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    // Allow access from any IP address
    port: 8080,
    strictPort: false,
    // allow Vite to pick a free port if 8080 is busy
    proxy: {
      // Forward /api/* to backend in development to avoid CORS
      // Set target with your backend URL or use VITE_PROXY_TARGET env
      "/api": {
        target: process.env.VITE_PROXY_TARGET || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJbXplblxcXFxEb2N1bWVudHNcXFxcRGVza3RvcCBTYWZlXFxcXHplbi1jYW52YXMtc3BhY2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEltemVuXFxcXERvY3VtZW50c1xcXFxEZXNrdG9wIFNhZmVcXFxcemVuLWNhbnZhcy1zcGFjZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvSW16ZW4vRG9jdW1lbnRzL0Rlc2t0b3AlMjBTYWZlL3plbi1jYW52YXMtc3BhY2Uvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjAuMC4wLjBcIiwgLy8gQWxsb3cgYWNjZXNzIGZyb20gYW55IElQIGFkZHJlc3NcclxuICAgIHBvcnQ6IDgwODAsXHJcbiAgICBzdHJpY3RQb3J0OiBmYWxzZSwgLy8gYWxsb3cgVml0ZSB0byBwaWNrIGEgZnJlZSBwb3J0IGlmIDgwODAgaXMgYnVzeVxyXG4gICAgcHJveHk6IHtcclxuICAgICAgLy8gRm9yd2FyZCAvYXBpLyogdG8gYmFja2VuZCBpbiBkZXZlbG9wbWVudCB0byBhdm9pZCBDT1JTXHJcbiAgICAgIC8vIFNldCB0YXJnZXQgd2l0aCB5b3VyIGJhY2tlbmQgVVJMIG9yIHVzZSBWSVRFX1BST1hZX1RBUkdFVCBlbnZcclxuICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IHByb2Nlc3MuZW52LlZJVEVfUFJPWFlfVEFSR0VUIHx8IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sIFwiXCIpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXHJcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtXLFNBQVMsb0JBQW9CO0FBQy9YLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQTtBQUFBLElBQ1osT0FBTztBQUFBO0FBQUE7QUFBQSxNQUdMLFFBQVE7QUFBQSxRQUNOLFFBQVEsUUFBUSxJQUFJLHFCQUFxQjtBQUFBLFFBQ3pDLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsRUFDbEIsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
