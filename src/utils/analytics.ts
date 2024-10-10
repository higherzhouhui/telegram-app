import ReactGA from 'react-ga';
const id = import.meta.env.GOOGLE_ID

export function initializeAnalytics() {
  ReactGA.initialize(id); // Replace G-XXXXXXXXXX with your tracking ID
  console.log('ReactGA is init')
}

export function trackPageView(page: any) {
  ReactGA.pageview(page);
  console.log('pageview is exec')
}
