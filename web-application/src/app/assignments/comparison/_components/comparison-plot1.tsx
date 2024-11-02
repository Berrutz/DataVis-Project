import UEEmission1Year from "./UE-emission-1year";

export default function Plot1() {
    return (
        <section className="flex flex-col items-center justify-center">
            <h1 className="mb-24 mt-24 font-serif text-4xl font-medium">CO2 emissions per capita of the countries of the European Union (EU-27), year 2012</h1>
            <div>
                <UEEmission1Year />
            </div>
        </section>
    )
}