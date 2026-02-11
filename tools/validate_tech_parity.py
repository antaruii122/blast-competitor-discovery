
from typing import Dict, Any, List, Tuple
import json

def validate_parity(target_specs: Dict[str, Any], candidate_specs: Dict[str, Any], rules: Dict[str, Any]) -> Tuple[bool, float, List[str]]:
    """
    Validates if a candidate matches the target specs based on Rules.
    Returns: (is_match, parity_score, logic_log)
    """
    log = []
    
    # 1. Gatekeeping (Boolean / String Strict Match)
    gatekeeping_rules = rules.get("gatekeeping", {})
    for feature, strict in gatekeeping_rules.items():
        target_val = target_specs.get(feature)
        candidate_val = candidate_specs.get(feature)
        
        # Normalize for comparison
        t_norm = str(target_val).lower().strip() if target_val else None
        c_norm = str(candidate_val).lower().strip() if candidate_val else None
        
        if strict and t_norm and c_norm and t_norm != c_norm:
            log.append(f"Gatekeeping FAIL: {feature} (Target: {target_val}, Candidate: {candidate_val})")
            return False, 0.0, log
        elif not strict and t_norm != c_norm:
             log.append(f"Soft Gate Mismatch: {feature}")

    # 2. Numeric Tolerance
    numeric_keys = rules.get("numeric_specs", [])
    tolerance_pct = rules.get("tolerance", 0.20)
    
    match_score_accum = 0.0
    valid_comparisons = 0
    
    for key in numeric_keys:
        t_num = target_specs.get(key)
        c_num = candidate_specs.get(key)
        
        if t_num is None or c_num is None:
            continue
            
        try:
            t_val = float(t_num)
            c_val = float(c_num)
            
            # Avoid division by zero
            if t_val == 0: 
                continue
                
            delta = abs(t_val - c_val) / t_val
            
            if delta <= tolerance_pct:
                log.append(f"Numeric PASS: {key} (Delta {delta:.2%})")
                match_score_accum += (1.0 - delta) # Higher score for closer match
                valid_comparisons += 1
            else:
                log.append(f"Numeric FAIL: {key} (Delta {delta:.2%} > {tolerance_pct:.0%})")
                return False, 0.0, log
                
        except ValueError:
            log.append(f"Numeric Error: Could not parse {key}")
            
    # Final Score Calculation
    final_score = match_score_accum / valid_comparisons if valid_comparisons > 0 else 0.5
    
    log.append(f"Match SUCCESS. Score: {final_score:.2f}")
    return True, final_score, log

if __name__ == "__main__":
    # Internal Type Test
    rules_mock = {
        "gatekeeping": {"panel_type": True},
        "numeric_specs": ["refresh_rate_hz"],
        "tolerance": 0.20
    }
    t_spec = {"panel_type": "IPS", "refresh_rate_hz": 165}
    c_spec_pass = {"panel_type": "IPS", "refresh_rate_hz": 170}
    c_spec_fail_gate = {"panel_type": "VA", "refresh_rate_hz": 170}
    c_spec_fail_num = {"panel_type": "IPS", "refresh_rate_hz": 240} # > 20% diff
    
    print("Test Pass:", validate_parity(t_spec, c_spec_pass, rules_mock))
    print("Test Fail Gate:", validate_parity(t_spec, c_spec_fail_gate, rules_mock))
    print("Test Fail Num:", validate_parity(t_spec, c_spec_fail_num, rules_mock))
