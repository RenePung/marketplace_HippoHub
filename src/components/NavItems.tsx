"use client";
import { PRODUCT_CATEGORIES } from "@/config";
import { useState, useRef, useEffect } from "react";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
//*************************************IMPORTS*************************************
const NavItems = () => {
    const [activeIndex, setActiveIndex] = useState<null | number>(null)

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setActiveIndex(null) // closing navbar with esc button
            }
        }

        document.addEventListener("keydown", handler)

        return () => {
            document.removeEventListener("keydown", handler)
        }
    }, [])

    const isAnyOpen = activeIndex !== null

    const navRef = useRef<HTMLDivElement | null>(null)

    useOnClickOutside(navRef, () => setActiveIndex(null)) // closing navbar with clicking outside of the navbar


    return (
        <div className="flex gap-4 h-full" ref={navRef}>
            {PRODUCT_CATEGORIES.map((category, i) => {

                const handleOpen = () => {
                    if(activeIndex === i) {
                        setActiveIndex(null)
                    } else {
                        setActiveIndex(i)
                    }
                }

                const isOpen = i === activeIndex

                return (
                    <NavItem 
                    category={category} 
                    handleOpen={handleOpen}
                    isOpen={isOpen}
                    key={category.value}
                    isAnyOpen={isAnyOpen}
                    />
                )
            })}
        </div>
    )
}
export default NavItems
