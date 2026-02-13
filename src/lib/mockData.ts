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
