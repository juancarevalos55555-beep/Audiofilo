export const mockEquipmentData = {
    brand: "Marantz",
    model: "Model 2270",
    era: "1971-1975",
    origin: "Chatsworth, California (USA) / Tokyo (Japón)",
    statusLabel: "Santo Grial del Vintage",
    cultFactor: 5,
    specs: [
        { label: "Potencia Continua", value: "70 Watts por canal (8 Ohms)" },
        { label: "Respuesta de Frecuencia", value: "7Hz a 50kHz" },
        { label: "Distorsión Armónica Total (THD)", value: "0.3%" },
        { label: "Factor de Amortiguamiento", value: "45" },
        { label: "Peso", value: "17.5 kg (38.5 lbs)" },
    ],
    topology: {
        architecture: "Amplificación de Acoplamiento Directo (Direct Coupled)",
        criticalParts: ["Capacitores ELNA de Grado Audio", "Transistores de Salida Motorola", "Transformador Toroidal Blindado"],
        signalFlow: "Ruta de señal pura Clase AB con ecualización Phono RIAA de alta precisión.",
    },
    expertInsights: {
        mainComment: "El 2270 representa el apogeo del 'Sonido Marantz' de los 70—cálido, detallado y con una reserva dinámica impresionante. Su panel de aluminio cepillado y luces azules son íconos absolutos.",
        commonIssues: [
            "Secado de pasta térmica en transistores de salida",
            "Corrosión en selectores de fuente (deslizadores)",
            "Vampirización de capacitores originales de la fuente"
        ],
        synergyTip: "Ideal con parlantes de alta sensibilidad como JBL L100 o Klipsch Heresy para resaltar su calidez en los medios."
    },
    marketData: {
        priceRange: "$800 - $1,600",
        liquidity: "Media-Alta",
        trend: "En Alza",
        investmentInsight: "Un valor seguro en el mercado vintage. Los precios han subido un 25% en los últimos 2 años debido a la alta demanda de coleccionistas."
    }
};

export const connectionRules = {
    sources: [
        { id: "turntable", label: "Tornamesa", cable: "RCA con Tierra (Phono)", tip: "Requiere preamplificador de Phono si el ampli no tiene entrada dedicada." },
        { id: "dac", label: "DAC / Streamer", cable: "RCA Estándar o XLR", tip: "Usa XLR si tu amplificador es balanceado para menor ruido." },
        { id: "cd", label: "Reproductor CD", cable: "Digital Coaxial o Toslink", tip: "Deja que el DAC externo haga la conversión para mejor detalle." }
    ],
    amplifiers: [
        { id: "integrated", label: "Integrado de Estado Sólido", cable: "Cable de Parlante 14/16 AWG", tip: "Ideal para la mayoría de parlantes modernos." },
        { id: "tube", label: "Amplificador de Tubos", cable: "Cables de Alta Pureza", tip: "Cuidado con la impedancia; usa el tap de 4 u 8 ohms según tus parlantes." }
    ],
    speakers: [
        { id: "bookshelf", label: "Bookshelf (Monitor)", placement: "En pedestales, a nivel del oído.", tip: "Ganarán mucha respuesta de bajos si los acercas un poco a la pared." },
        { id: "floorstanding", label: "Torres (Full Range)", placement: "Con espacio suficiente hacia atrás.", tip: "Asegúrate de que tengan suficiente corriente del amplificador." }
    ]
};

export const legendaryEquipment = [
    {
        id: "m2270",
        brand: "Marantz",
        model: "Model 2270",
        type: "Receiver",
        year: "1971",
        description: "El santo grial de los receivers de los 70.",
        specs: ["70W por canal", "Filtro de Gyro-Touch", "Look icónico azul"]
    },
    {
        id: "l100",
        brand: "JBL",
        model: "L100 Century",
        type: "Parlantes",
        year: "1970",
        description: "Los parlantes más vendidos de la historia de JBL.",
        specs: ["Grilla Quadrex", "Driver de 12 pulgadas", "Sonido West Coast"]
    },
    {
        id: "sl1200",
        brand: "Technics",
        model: "SL-1200 MK2",
        type: "Tornamesa",
        year: "1979",
        description: "El estándar industrial de torque y durabilidad.",
        specs: ["Direct Drive", "Control de Pitch", "Chasis antivibración"]
    },
    {
        id: "sa1000",
        brand: "Sansui",
        model: "G-33000",
        type: "Receiver",
        year: "1978",
        description: "Uno de los receivers más potentes y grandes jamás construidos.",
        specs: ["300W por canal", "Diseño de dos torres", "Pure Power DC"]
    }
];
