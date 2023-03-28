import dynamic from "next/dynamic"
export default dynamic(import ("../../lib/components/player"),{ssr:false});