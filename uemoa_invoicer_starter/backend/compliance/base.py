from dataclasses import dataclass
from typing import List

@dataclass
class InvoiceRule:
    code: str
    required_seller_fields: List[str]
    numbering_format: str  # e.g. FAC-{COUNTRY}-{YYYY}-{SEQ:6}
    vat_label: str = "TVA"

class ComplianceAdapter:
    def rules(self) -> InvoiceRule: ...
    def validate_invoice(self, invoice) -> list[str]: ...
