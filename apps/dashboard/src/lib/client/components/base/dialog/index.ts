import { Dialog as DialogPrimitive } from "bits-ui"

import Content from "./DialogContent.svelte"
import Description from "./DialogDescription.svelte"
import Footer from "./DialogFooter.svelte"
import Header from "./DialogHeader.svelte"
import Overlay from "./DialogOverlay.svelte"
import Title from "./DialogTitle.svelte"

const Root: typeof DialogPrimitive.Root = DialogPrimitive.Root
const Trigger: typeof DialogPrimitive.Trigger = DialogPrimitive.Trigger
const Close: typeof DialogPrimitive.Close = DialogPrimitive.Close
const Portal: typeof DialogPrimitive.Portal = DialogPrimitive.Portal

export {
    Close,
    Content,
    Description,
    //
    Root as Dialog,
    Close as DialogClose,
    Content as DialogContent,
    Description as DialogDescription,
    Footer as DialogFooter,
    Header as DialogHeader,
    Overlay as DialogOverlay,
    Portal as DialogPortal,
    Title as DialogTitle,
    Trigger as DialogTrigger,
    Footer,
    Header,
    Overlay,
    Portal,
    Root,
    Title,
    Trigger,
}
