# Assets - Imagens

## Freech (Avatar do Assistente)

**⚠️ IMPORTANTE:** No Next.js, imagens estáticas devem ficar na pasta `public/` na raiz do projeto.

Para usar o avatar real do Freech:

1. Salve a imagem do pinguim Freech como `freech-avatar.jpg` na pasta `public/` (não aqui)
2. O componente `FreechAvatar.tsx` já está configurado para usar:

```tsx
<img
  src="/freech-avatar.jpg"
  alt="Freech - Assistente CareAI"
  className="w-full h-full object-cover"
/>
```

## Estrutura correta para Next.js:

```
public/
├── freech-avatar.jpg     ← Imagem principal do Freech
├── freech-avatar-sm.jpg  ← Versão pequena (opcional)
└── favicon.svg
```

## Caminhos de imagem no Next.js:

- ✅ `/freech-avatar.jpg` (correto - pasta public)
- ❌ `/src/assets/images/freech-avatar.jpg` (incorreto)
