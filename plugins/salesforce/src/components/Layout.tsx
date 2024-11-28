import React from "react"
import { motion } from "framer-motion"
import cx from "classnames"
import { CaretLeftIcon } from "./Icons"

const PageDivider = () => (
    <div className="px-[15px]">
        <hr />
    </div>
)

interface TitleProps {
    title: string
    animateForward?: boolean
}

const Title = ({ title, animateForward }: TitleProps) => (
    <React.Fragment>
        <PageDivider />
        <div className="flex gap-[5px] items-center overflow-hidden min-h-10">
            <div onClick={history.back} className="flex items-center pl-[15px] cursor-pointer">
                <CaretLeftIcon />
            </div>
            <motion.div
                className="py-[15px]"
                initial={{ opacity: 0.85, x: animateForward ? 45 : -45 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0.85, x: animateForward ? -30 : 30 }}
                transition={{
                    type: "spring",
                    damping: 16,
                    stiffness: 450,
                    mass: 0.08,
                    velocity: 600,
                    duration: 0.25,
                    delay: 0.05,
                }}
            >
                <h6 className="truncate text-ellipsis max-w-[216px]">{title}</h6>
            </motion.div>
        </div>
    </React.Fragment>
)

interface Props {
    children: React.ReactNode
    className?: string
    title?: string
    animateForward?: boolean
}

export const Layout = ({ children, className, title, animateForward }: Props) => (
    <div className={cx("flex flex-col w-full h-full", className)}>
        {title && <Title title={title} animateForward={animateForward} />}
        <PageDivider />
        <div className="col-lg w-full h-full">{children}</div>
    </div>
)
