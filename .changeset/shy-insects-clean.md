---
"@traversable/zod": patch
---

bench(zods): adds benchmarks that prevent compiler optimizations, including:
- dead code elimination
- loop invariant code motion
