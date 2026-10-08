import CTA from "../components/landing/CTA"
import Feat from "../components/landing/Feat"
import Footer from "../components/landing/Footer"
import Hero from "../components/landing/Hero"
import Metrics from "../components/landing/Metrics"
import Ratings from "../components/landing/Ratings"

const HomeView = () => {
    return (
        <div>
            <Hero />
            <Feat />
            <Metrics />
            <Ratings />
            <CTA />
            <Footer />
        </div>
    )
}

export default HomeView