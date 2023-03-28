import dynamic from "next/dynamic"
export default dynamic(import ("../../lib/components/ShakaPlayer"),{ssr:false});