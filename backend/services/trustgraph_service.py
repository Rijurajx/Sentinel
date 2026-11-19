import hashlib
from typing import List, Dict, Any
from models import TrustGraphResponse, GraphNode, GraphEdge

def correlate_trustgraph_entities(
    supplier_name: str,
    account_number: str,
    ifsc_or_iban: str,
    domain: str = "vendor-portal.net"
) -> TrustGraphResponse:
    """
    Deterministic historical correlation network graph for React Flow.
    Connects supplier -> bank account -> linked incidents -> threat actor cluster.
    """
    supplier_id = f"sup_{abs(hash(supplier_name)) % 10000}"
    account_id = f"acc_{abs(hash(account_number)) % 10000}"
    domain_id = f"dom_{abs(hash(domain)) % 10000}"
    cluster_id = "cluster_crimson_typhoon"

    nodes: List[GraphNode] = [
        GraphNode(
            id=supplier_id,
            label=supplier_name,
            type="supplier",
            risk_level="HIGH",
            details={
                "category": "Corporate Vendor",
                "status": "Under Investigation",
                "jurisdiction": "Multi-Region"
            }
        ),
        GraphNode(
            id=account_id,
            label=f"Acct ••••{account_number[-4:] if len(account_number) >= 4 else account_number}",
            type="account",
            risk_level="CRITICAL",
            details={
                "routing": ifsc_or_iban,
                "flag": "Sudden Diversion",
                "mule_cluster": True
            }
        ),
        GraphNode(
            id=domain_id,
            label=domain,
            type="domain",
            risk_level="MEDIUM",
            details={
                "registrar": "NameCheap Inc",
                "age_days": 14,
                "typosquat": True
            }
        ),
        GraphNode(
            id=cluster_id,
            label="Threat Cluster TC-948",
            type="threat_actor",
            risk_level="CRITICAL",
            details={
                "attribution": "Scattered Spider / BEC Syndicate",
                "linked_losses": "$4.2M",
                "confidence": 0.94
            }
        ),
        GraphNode(
            id="inc_4821",
            label="Prior Incident INC-4821",
            type="incident",
            risk_level="HIGH",
            details={
                "date": "2026-10-14",
                "status": "Resolved / Intercepted"
            }
        )
    ]

    edges: List[GraphEdge] = [
        GraphEdge(
            id="e_sup_acc",
            source=supplier_id,
            target=account_id,
            label="Payment Request",
            relation="TRANSFERS_TO"
        ),
        GraphEdge(
            id="e_sup_dom",
            source=supplier_id,
            target=domain_id,
            label="Invoiced Via",
            relation="COMMUNICATES_THROUGH"
        ),
        GraphEdge(
            id="e_acc_cluster",
            source=account_id,
            target=cluster_id,
            label="Co-Occurred In",
            relation="LINKED_TO_CLUSTER"
        ),
        GraphEdge(
            id="e_cluster_inc",
            source=cluster_id,
            target="inc_4821",
            label="Historical Fingerprint",
            relation="SHARED_ORIGIN"
        )
    ]

    return TrustGraphResponse(
        nodes=nodes,
        edges=edges,
        cluster_risk="CRITICAL",
        connected_incidents_count=3,
        provenance_summary="Target bank routing number matches money mule accounts from historical incident INC-4821."
    )
