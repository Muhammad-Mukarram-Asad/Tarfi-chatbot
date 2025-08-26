
import Image from "next/image"

export function ChatHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-b-gray-300">
      <div className="flex items-center gap-3">
        <Image src={'/content.svg'} alt={""} width={40} height={40}/>
        <span className="font-medium text-gray-900">Tarfi</span>
      </div>
      
       
        
      
    </div>
  )
}
