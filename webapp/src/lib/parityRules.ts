// Maps hardware categories to their Critical and Variable specifications
// used to visually enforce technical parity rules in the frontend UI.

export interface CategoryParityRules {
    critical: string[]; // Specs that MUST match (Dealbreakers)
    variable: string[]; // Specs that can vary (Minor differences)
}

export const PARITY_RULES: Record<string, CategoryParityRules> = {
    headset: {
        critical: [
            'earcup_design',
            'surround_sound_type',
            'connection_type',
            'microphone_presence',
            'battery_system_type',
            'anc_active_noise_cancellation',
            'acoustic_design',
            'Surround Type',
            'Battery System',
            'ANC',
            'Connection',
            'Open/Closed Back'
        ],
        variable: [
            'driver_size_mm',
            'frequency_response_low_hz',
            'frequency_response_high_hz',
            'impedance_tier',
            'Driver Size',
            'Frequency',
            'Battery Life'
        ]
    },
    gaming_chair: {
        critical: [
            'style_design',
            'size_class',
            'lumbar_support_type',
            'recline_range_tier',
            'Chair Style',
            'Size Class',
            'Lumbar Type',
            'Recline Range'
        ],
        variable: [
            'upholstery_material',
            'armrest_type',
            'weight_capacity_kg',
            'Upholstery',
            'Armrests'
        ]
    },
    gaming_table: {
        critical: [
            'motorized_height_adjust',
            'monitor_arm_compatibility',
            'size_class',
            'cable_management_tier',
            'Lift Mechanism',
            'Cable Infrastructure',
            'Size Class'
        ],
        variable: [
            'weight_capacity_tier',
            'material_quality',
            'width_cm',
            'depth_cm',
            'max_load_kg',
            'Desktop Material',
            'RGB'
        ]
    },
    gpu: {
        critical: [
            'chipset',
            'vram_gb',
            'Chipset',
            'VRAM Capacity'
        ],
        variable: [
            'power_connector_type',
            'cooling_solution_tier',
            'boost_clock_mhz',
            'length_mm',
            'Cooling Solution',
            'Clock Speed',
            'Dimensions'
        ]
    },
    cooling: {
        critical: [
            'cooling_type',
            'tdp_rating_tier',
            'radiator_size',
            'Type',
            'Radiator Size',
            'TDP Class'
        ],
        variable: [
            'air_cooler_height_mm',
            'fan_rpm_max',
            'noise_level_db',
            'Fan Noise',
            'Height',
            'RGB'
        ]
    },
    monitor: {
        critical: [
            'aspect_ratio',
            'panel_type',
            'resolution',
            'use_case_market_segment',
            'screen_curvature',
            'refresh_rate_tier',
            'Panel Type',
            'Resolution',
            'Refresh Rate',
            'Curvature'
        ],
        variable: [
            'refresh_rate_hz',
            'response_time_ms',
            'size_inch',
            'Brightness/HDR',
            'Stand'
        ]
    },
    mouse: {
        critical: [
            'grip_style_optimization',
            'sensor_tier',
            'weight_class',
            'Sensor Type',
            'Connection',
            'Weight Class'
        ],
        variable: [
            'connection_type',
            'dpi_max',
            'weight_g',
            'polling_rate_hz',
            'Shape/Grip',
            'Button Count'
        ]
    },
    keyboard: {
        critical: [
            'switch_type',
            'form_factor_layout',
            'hot_swappable',
            'Switch Type',
            'Form Factor',
            'Connection',
            'Hotswap'
        ],
        variable: [
            'connection_type',
            'polling_rate_hz',
            'Keycap Material',
            'RGB'
        ]
    },
    power_supply: {
        critical: [
            'Wattage',
            'Efficiency',
            'Modularity',
            'ATX Standard'
        ],
        variable: [
            'Fan Mode'
        ]
    },
    case: {
        critical: [
            'form_factor',
            'tempered_glass_style',
            'front_panel_design',
            'showcase_intent',
            'physical_build_class',
            'Form Factor',
            'Tempered Glass',
            'Front Panel',
            'Showcase',
            'Build Class'
        ],
        variable: [
            'gpu_clearance_tier',
            'radiator_support_tier',
            'fan_count_preinstalled',
            'height_mm',
            'width_mm',
            'depth_mm',
            'GPU Clearance',
            'Radiator Support',
            'Preinstalled Fans',
            'Dimensions'
        ]
    },
    motherboard: {
        critical: [
            'socket',
            'chipset',
            'form_factor',
            'memory_type',
            'Socket',
            'Chipset',
            'Form Factor',
            'Memory Type'
        ],
        variable: [
            'memory_slots',
            'pcie_generation',
            'Memory Slots',
            'PCIe Gen'
        ]
    }
};

/**
 * Returns the parity status of a specific specification difference.
 */
export function getSpecParityStatus(category: string | undefined, specName: string): 'critical' | 'variable' | 'unknown' {
    const normalizedSpec = specName.trim().toLowerCase();

    // If category is provided, check category specifically
    if (category) {
        const rules = PARITY_RULES[category.toLowerCase()] || PARITY_RULES[category.replace(' ', '_').toLowerCase()];
        if (rules) {
            if (rules.critical.some(c => normalizedSpec.includes(c.toLowerCase()))) return 'critical';
            if (rules.variable.some(v => normalizedSpec.includes(v.toLowerCase()))) return 'variable';
            return 'variable';
        }
    }

    // If category is unknown, check globally across all categories
    for (const [key, rules] of Object.entries(PARITY_RULES)) {
        if (rules.critical.some(c => normalizedSpec.includes(c.toLowerCase()))) return 'critical';
    }

    return 'variable';
}
