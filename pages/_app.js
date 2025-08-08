import { DrinkProvider } from '../context/drink'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <DrinkProvider>
      <Component {...pageProps} />
    </DrinkProvider>
  )
}

export default MyApp