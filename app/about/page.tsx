import Image from 'next/image';
import Link from 'next/link';

const About = () => {
    return (
        <div className="p-8 bg-gray-50">
            <h1 className="text-4xl font-bold mb-6 text-center text-blue-900">Storia del Mar Menor</h1>

            {/* Un ecosistema straordinario */}
            <div className="flex flex-col md:flex-row mb-12 items-center hover:scale-105 transition-transform duration-300 px-4">
                <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                    <Image src="/images/lagunaAlto.jpg" alt="Ecosistema del Mar Menor" width={500} height={300} className="rounded-lg shadow-xl"/>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-800">Un ecosistema straordinario</h2>
                    <p className="text-base text-gray-700">
                    Il Mar Menor, una laguna salata di 135 chilometri quadrati e la più estesa d’Europa, situata nella regione spagnola di Murcia, era un tempo un ecosistema straordinario, rinomato per le sue acque cristalline e la ricca biodiversità. Questa laguna salmastra, separata dal Mediterraneo da una sottile lingua di terra, offriva un rifugio naturale a numerose specie marine e attirava turisti da tutto il mondo. Il paesaggio pittoresco, l'abbondanza di flora e fauna e il suo valore ecologico rendevano il Mar Menor una destinazione ideale per chi cercava tranquillità e bellezza naturale.
                    </p>
                </div>
            </div>

            {/* I problemi ambientali */}
            <div className="flex flex-col md:flex-row-reverse mb-12 items-center hover:scale-105 transition-transform duration-300 px-4">
                <div className="md:w-1/3 mb-4 md:mb-0 md:ml-6">
                    <Image src="/images/terreniLaguna.jpg" alt="Problemi ambientali" width={500} height={300} className="rounded-lg shadow-xl"/>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-800">I problemi ambientali</h2>
                    <p className="text-base text-gray-700">
                    Tuttavia, negli ultimi decenni, il delicato equilibrio di questo ecosistema ha subito danni irreversibili, principalmente a causa dell’agricoltura intensiva, della massiccia urbanizzazione nelle zone circostanti e dello sviluppo turistico. L'uso estensivo di fertilizzanti nelle coltivazioni ha portato a un costante afflusso di sostanze chimiche nelle acque della laguna. Questi fertilizzanti, carichi di nutrienti come azoto e fosforo, hanno dato origine a fenomeni di <span className="font-bold">eutrofizzazione</span>, una condizione in cui la proliferazione incontrollata di alghe impedisce ai raggi solari di penetrare nelle profondità della laguna, riducendo drasticamente i livelli di ossigeno nell'acqua. Questo fenomeno ha causato la morte di molte specie vegetali e animali, compromettendo gravemente la biodiversità che un tempo fioriva nella laguna.
                    </p>
                </div>
            </div>

            {/* Una crisi senza precedenti */}
            <div className="flex flex-col md:flex-row mb-12 items-center hover:scale-105 transition-transform duration-300 px-4">
                <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                    <Image src="/images/pesciLaguna.jpg" alt="Crisi ambientale" width={500} height={300} className="rounded-lg shadow-xl"/>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-800">Una crisi senza precedenti</h2>
                    <p className="text-base text-gray-700">
                    Tra il 2015 e il 2019, il Mar Menor ha vissuto momenti drammatici, con l'acqua che cambiava colore, assumendo una tonalità verdognola a causa dell’esplosione di alghe. Uno degli episodi più tragici si è verificato nell'agosto del 2019, quando ben cinque tonnellate di pesci e crostacei morti si sono riversati sulle rive della laguna. La vista degli animali senza vita, unita all'odore sgradevole della decomposizione e alla qualità dell'acqua fortemente compromessa, ha suscitato un'ondata di indignazione tra residenti e turisti, provocando la chiusura di numerose spiagge.
                    </p>
                </div>
            </div>

            {/* Le tensioni e le responsabilità */}
            <div className="flex flex-col md:flex-row-reverse mb-12 items-center hover:scale-105 transition-transform duration-300 px-4">
                <div className="md:w-1/3 mb-4 md:mb-0 md:ml-6">
                    <Image src="/images/proteste.jpg" alt="Tensioni e responsabilità" width={500} height={300} className="rounded-lg shadow-xl"/>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-800">Le tensioni e le responsabilità</h2>
                    <p className="text-base text-gray-700">
                    Per anni, la gestione delle problematiche ambientali legate al Mar Menor è stata oggetto di tensioni e disaccordi tra il governo nazionale e le autorità locali della Murcia. Da un lato, il governo centrale ha denunciato l’incapacità della regione di regolamentare adeguatamente l’uso dei fertilizzanti e di monitorare le pratiche agricole che contribuiscono all’inquinamento della laguna. Dall’altro, l'amministrazione regionale ha spesso minimizzato la portata del problema, attribuendo i danni alle alte temperature stagionali e cercando di deviare le responsabilità.
                    </p>
                </div>
            </div>

            {/* Un passo storico: personalità giuridica */}
            <div className="flex flex-col md:flex-row mb-12 items-center hover:scale-105 transition-transform duration-300 px-4">
                <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                    <Image src="/images/teresaVicente.jpg" alt="Personalità giuridica" width={500} height={300} className="rounded-lg shadow-xl"/>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-800">Un passo storico: personalità giuridica</h2>
                    <p className="text-base text-gray-700">
                    Nel 2022, grazie all'attivista <span className="font-bold">Teresa Vicente</span>, è stato compiuto un passo storico per la protezione del Mar Menor: la laguna ha ottenuto lo status di "persona giuridica," diventando il primo ecosistema in Europa a ricevere un tale riconoscimento legale. Questo status conferisce al Mar Menor il diritto di essere rappresentato da avvocati e difensori in tribunale, permettendo agli abitanti, alle associazioni e ai sostenitori della causa ecologica di agire legalmente per la sua salvaguardia.
                    </p>
                </div>
            </div>

            {/* Iniziative di recupero */}
            <div className="flex flex-col md:flex-row-reverse mb-12 items-center hover:scale-105 transition-transform duration-300 px-4">
                <div className="md:w-1/3 mb-4 md:mb-0 md:ml-6">
                    <Image src="/images/attivisti.jpg" alt="Iniziative di recupero" width={500} height={300} className="rounded-lg shadow-xl"/>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-800">Iniziative di recupero</h2>
                    <p className="text-base text-gray-700">
                    Il governo spagnolo ha quindi stanziato quasi 500 milioni di euro per iniziative di recupero e protezione della laguna. Un comitato scientifico è stato incaricato di monitorare lo stato di salute del Mar Menor, con l’obiettivo di ristabilire, almeno in parte, il suo equilibrio ecologico.                    </p>
                </div>
            </div>

            {/* Progetti attuali per il futuro */}
            <div className="flex flex-col md:flex-row mb-12 items-center hover:scale-105 transition-transform duration-300 px-4">
                <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                    <Image src="/images/litoraleLaguna.jpg" alt="Progetti attuali per il futuro" width={500} height={300} className="rounded-lg shadow-xl"/>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-800">Progetti attuali per il futuro del Mar Menor</h2>
                    <ul className="list-disc pl-5 mb-4 text-gray-700">
                        <li><span className="font-bold">Progetti di Conservazione</span>: Le autorità regionali e il governo spagnolo stanno lavorando per limitare l'uso di fertilizzanti nelle aree circostanti e monitorare meglio i flussi di nutrienti verso la laguna.</li>
                        <li><span className="font-bold">SMARTLAGOON e Soluzioni Tecnologiche</span>:  Progetti come SMARTLAGOON mirano a sviluppare digital twins (gemelli digitali) per monitorare in tempo reale lo stato ecologico della laguna, integrando dati su qualità dell’acqua, biodiversità e altri parametri ambientali.</li>
                        <li><span className="font-bold">Ripristino degli Habitat Naturali</span>: Ci sono anche progetti per ripristinare le aree costiere e le piante marine che possono migliorare la qualità dell'acqua e sostenere la biodiversità.</li>
                    </ul>
                </div>
            </div>

            {/* Logo ChatGPT cliccabile */}
            <div className="mt-6 flex justify-end">
                <Link href="/chatbot">
                    <Image
                        src="/images/chatgpt-logo.png" 
                        alt="Chatbot"
                        width={50}
                        height={50}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                </Link>
            </div>
        </div>
    );
};

export default About;
