import XRP from "./XRP"
import XLM from "./XLM"

export default ({ network, ...props }) => {

    return network === 'xlm' ? <XLM {...props} /> : <XRP {...props}/>
}