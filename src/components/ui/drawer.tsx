import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"

import { cn } from "@/lib/utils"

function DrawerProvider(props: React.ComponentProps<typeof DrawerPrimitive.Provider>) {
  return <DrawerPrimitive.Provider {...props} />
}

function Drawer(
  props: React.ComponentPropsWithRef<typeof DrawerPrimitive.Root>
) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Trigger>) {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

function DrawerClose({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Close>) {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

function DrawerBackdrop({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Backdrop>) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function DrawerPopup({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Popup>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Popup
        data-slot="drawer-popup"
        className={cn(
          "fixed inset-0 z-50 flex justify-end bg-background text-foreground ring-1 ring-foreground/10 shadow-lg transition-transform duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:translate-x-full data-starting-style:translate-x-full data-[nested-drawer-open=true]:translate-x-[-40%] data-[nested-drawer-swiping=true]:duration-0",
          className
        )}
        {...props}
      />
    </DrawerPrimitive.Portal>
  )
}

function DrawerContent({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPrimitive.Content
      data-slot="drawer-content"
      className={cn(
        "flex h-full w-full max-w-sm flex-col gap-2.5 overflow-auto p-5 text-start sm:max-w-md",
        className
      )}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "my-0 text-lg font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DrawerIndent({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Indent>) {
  return (
    <DrawerPrimitive.Indent
      data-slot="drawer-indent"
      className={cn(
        "transition-[padding,border-radius] duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)]",
        className
      )}
      {...props}
    />
  )
}

function DrawerIndentBackground({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.IndentBackground>) {
  return (
    <DrawerPrimitive.IndentBackground
      data-slot="drawer-indent-background"
      className={cn(
        "transition-[background-color] duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)] data-[inactive]:bg-background data-[active]:bg-muted dark:data-[inactive]:bg-background dark:data-[active]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function DrawerSwipeArea({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.SwipeArea>) {
  return (
    <DrawerPrimitive.SwipeArea
      data-slot="drawer-swipe-area"
      className={cn("h-full w-8", className)}
      {...props}
    />
  )
}

export {
  DrawerProvider,
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerBackdrop,
  DrawerPopup,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerSwipeArea,
  DrawerIndent,
  DrawerIndentBackground,
}