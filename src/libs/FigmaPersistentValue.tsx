import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { FigmaMessageEvent } from "../type"
import { POST_MESSAGE_TYPE } from "../consts"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FigmaPersistentValueContext = createContext<Record<string,any>>({})



const loadPersistentValue = () => {
    parent.postMessage({pluginMessage:{type: POST_MESSAGE_TYPE.LOAD_ALL}}, '*')
}

export const FigmaPersistentValueProvider = ({children}: {children: ReactNode}) => {
    const [initialPersistentValue, setInitialPersistentValue] = useState({})
    

    useEffect(()=>{
        loadPersistentValue()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loadAllHandler = (event: FigmaMessageEvent)=>{
            const msg = event.data.pluginMessage
            if(msg.type === POST_MESSAGE_TYPE.LOAD_ALL){
                setInitialPersistentValue(msg.data)
            }
        }
    
        

        window.addEventListener('message', loadAllHandler)

        return ()=> {
          window.removeEventListener('message', loadAllHandler)
        }
      },[])
    return (
        <FigmaPersistentValueContext.Provider value={initialPersistentValue}>
            {children}
        </FigmaPersistentValueContext.Provider>
    )
}

export const useFigmaPersistentValue = () => {
    const context = useContext(FigmaPersistentValueContext)
    if (!context) {
        throw new Error("useFigmaPersistentValue must be used within a FigmaPersistentValueProvider")
    }

     const savePersistentValue = useCallback((key: string, value: string) => {
        parent.postMessage({
          pluginMessage: {
            type: 'save',
            [key]: value
          }
        }, '*');
        loadPersistentValue()
      },[])
      
    return {
        value:context,
        savePersistentValue
    }
}