import { Children, isValidElement, PropsWithChildren } from "react"

export const CommonLayout = ({children}:PropsWithChildren)=>{
    const childrenArray = Children.toArray(children)

    const Bottom= childrenArray.find(item=> isValidElement(item) && item.type=== CommonLayout.Bottom)
   const Content = childrenArray.find(item=> isValidElement(item) && item.type=== CommonLayout.Content)

    return (
        <div style={{position:'relative', height:'100%', display:'flex', flexDirection:'column'}}>
            <div style={{height: 'calc(100% - 50px)', overflow:'auto', borderBottom:'1px solid #ccc'}}>
            {Content}
            </div>
            <div style={{marginInline:'10', flex:1, display:'flex', alignItems:'center' , justifyContent:'space-between'}}>
            { Bottom }
            <button onClick={()=>{parent.postMessage({pluginMessage:{type: 'close'}}, '*')}}>Close</button>
            </div>

        </div>
    )
}

const Bottom = ({children}:PropsWithChildren)=>{
    return <footer id="footer">{children}</footer> 
}

const Content = ({children}:PropsWithChildren)=>{
    return <main id="main">{children}</main>
}


CommonLayout.Content = Content
CommonLayout.Bottom = Bottom