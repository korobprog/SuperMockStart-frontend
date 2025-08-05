#!/bin/bash

echo "Fixing @/ aliases in the project..."

# Replace aliases in pages/
echo "Fixing pages..."
find src/pages -name "*.tsx" -exec sed -i 's|from "@/components/ui/|from "../components/ui/|g' {} \;
find src/pages -name "*.tsx" -exec sed -i 's|from "@/components/|from "../components/|g' {} \;
find src/pages -name "*.tsx" -exec sed -i 's|from "@/hooks/|from "../hooks/|g' {} \;
find src/pages -name "*.tsx" -exec sed -i 's|from "@/lib/|from "../lib/|g' {} \;
find src/pages -name "*.tsx" -exec sed -i 's|from "@/utils/|from "../utils/|g' {} \;
find src/pages -name "*.tsx" -exec sed -i 's|from "@/store/|from "../store/|g' {} \;
find src/pages -name "*.tsx" -exec sed -i 's|from "@/data/|from "../data/|g' {} \;

# Replace aliases in components/ (excluding ui/)
echo "Fixing components..."
find src/components -name "*.tsx" -not -path "*/ui/*" -exec sed -i 's|from "@/components/ui/|from "./ui/|g' {} \;
find src/components -name "*.tsx" -not -path "*/ui/*" -exec sed -i 's|from "@/components/|from "./|g' {} \;
find src/components -name "*.tsx" -not -path "*/ui/*" -exec sed -i 's|from "@/hooks/|from "../hooks/|g' {} \;
find src/components -name "*.tsx" -not -path "*/ui/*" -exec sed -i 's|from "@/lib/|from "../lib/|g' {} \;
find src/components -name "*.tsx" -not -path "*/ui/*" -exec sed -i 's|from "@/utils/|from "../utils/|g' {} \;

# Replace aliases in components/ui/
echo "Fixing ui components..."
find src/components/ui -name "*.tsx" -exec sed -i 's|from "@/components/ui/|from "./|g' {} \;
find src/components/ui -name "*.tsx" -exec sed -i 's|from "@/components/|from "../|g' {} \;
find src/components/ui -name "*.tsx" -exec sed -i 's|from "@/lib/|from "../../lib/|g' {} \;
find src/components/ui -name "*.tsx" -exec sed -i 's|from "@/utils/|from "../../utils/|g' {} \;

echo "Done fixing aliases!"