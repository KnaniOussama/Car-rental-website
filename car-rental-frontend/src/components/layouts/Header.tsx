import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { ViewVerticalIcon } from "@radix-ui/react-icons";
import { Logo } from "../logo";
import { ModeToggle } from "../mode-toggle";

export function Header() {
    const [open, setOpen] = useState(false)

    return (
        <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
            <div className="container px-4 md:px-8 flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <NavLink to="/" className="mr-6 flex items-center space-x-2">
                        <Logo />
                    </NavLink>
                </div>

                {/* mobile */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                            <ViewVerticalIcon className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0 sm:max-w-xs">
                        <NavLink
                            to="/"
                            onClick={() => setOpen(false)}
                            className="flex items-center space-x-2">
                            <Logo />
                        </NavLink>
                        <div className="my-4 h-[calc(100vh-8rem)] pb-8 pl-8 flex flex-col">
                            <NavLink to="/login" onClick={() => setOpen(false)}>
                                <Button className="w-full">Login</Button>
                            </NavLink>
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="mr-6 flex items-center space-x-2 md:hidden">
                    <Logo />
                </div>
                
                {/* right */}
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center space-x-2">
                        <ModeToggle />
                        <NavLink 
                            to="/login" 
                            className={cn(
                                buttonVariants({ variant: "secondary" }),
                                "px-4"
                            )}
                        >
                            Login
                        </NavLink>
                    </nav>
                </div>
            </div>
        </header>
    )
}