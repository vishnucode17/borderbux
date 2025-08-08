import '@/styles/globals.css'
import '@/styles/components/navbar/nav.css'
import '@/styles/components/hero-section/hero.css'
import '@/styles/components/ratingsbanner/RatingsBanner.module.css'
import '@/styles/components/utils/drop_down.module.css'
import { Provider } from 'react-redux';
import { store } from '@/store/store'; 

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
