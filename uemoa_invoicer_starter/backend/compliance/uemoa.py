from .base import ComplianceAdapter, InvoiceRule

UEMOA = ["BJ","BF","CI","GW","ML","NE","SN","TG"]

class UEMOAAdapter(ComplianceAdapter):
    def rules(self):
        return InvoiceRule(
            code="UEMOA_OHADA_GENERIC",
            required_seller_fields=["trade_register","tax_id","address"],
            numbering_format="FAC-{COUNTRY}-{YYYY}-{SEQ:6}",
            vat_label="TVA",
        )
    def validate_invoice(self, invoice):
        errors = []
        org = invoice.organization
        if org.country_code not in UEMOA:
            return errors
        if not org.trade_register:
            errors.append("RCCM/RC manquant")
        if not org.tax_id:
            errors.append("IFU/NIF manquant")
        # Add uniqueness/sequential checks here
        return errors
