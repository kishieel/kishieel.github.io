'use client'

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Navigation() {
    const pathname = usePathname()
    console.log({ pathname })
    return (
        <nav className="bg-gray-800 max-w-5xl w-full">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link href={"/resume"}
                                      className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                                      aria-current={pathname.startsWith("/resume") ? "page" : undefined}>Resume</Link>
                                <Link href={"/blog"}
                                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                      aria-current={pathname.startsWith("/blog") ? "page" : undefined}>Blog</Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/*<div className="sm:hidden" id="mobile-menu">*/}
            {/*    <div className="space-y-1 px-2 pb-3 pt-2">*/}
            {/*        <a href="#" className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"*/}
            {/*           aria-current="page">Dashboard</a>*/}
            {/*        <a href="#"*/}
            {/*           className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Team</a>*/}
            {/*        <a href="#"*/}
            {/*           className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Projects</a>*/}
            {/*        <a href="#"*/}
            {/*           className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Calendar</a>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </nav>
    )
}
