\# Accessibility Component Notes



\## Comparison with shadcn/ui



I built a modal dialog, tabs, and disclosure component manually before installing shadcn/ui. The manual implementations helped me understand the keyboard and accessibility requirements instead of treating the components as black boxes.



\### Modal Dialog



My Modal component manually manages focus trapping, Escape handling, and focus restoration. This worked during keyboard testing, but shadcn's Dialog delegates the underlying accessibility behavior to `@base-ui/react/dialog`.



One concrete difference is that shadcn separates the dialog into reusable pieces such as DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogClose, DialogTitle, and DialogDescription. My Modal combines most of this behavior into one component.



Another difference is that shadcn provides built-in open/closed state styling and animation through data attributes. My implementation focuses on functionality and does not provide the same interaction states or visual polish.



\### Tabs



My Tabs component manually implements ArrowRight, ArrowLeft, Home, and End keyboard navigation, along with `aria-selected`, `aria-controls`, and roving tab indexes.



shadcn delegates the tab behavior to `@base-ui/react/tabs`. This means the accessibility and keyboard interaction logic is handled by a dedicated primitive rather than maintained manually in my component.



shadcn also provides additional flexibility that my implementation does not have, including horizontal and vertical orientation, disabled states, visual variants, focus-visible styling, and reusable TabsList, TabsTrigger, and TabsContent components.



\### What I Learned



The biggest difference is not simply that shadcn has more code. It provides reusable accessibility primitives and composition patterns that reduce the amount of accessibility behavior developers have to implement and maintain themselves.



Building the components first helped me understand what those primitives are doing. I can now recognize the purpose of focus management, keyboard navigation, ARIA relationships, and focus-visible states instead of copying a component without understanding it.

