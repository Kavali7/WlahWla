from .base import ComplianceAdapter, InvoiceRule


class BeninAdapter(ComplianceAdapter):
    def rules(self):
        return InvoiceRule(
            code="BJ_GENERIC",
            required_seller_fields=["trade_register", "tax_id", "address"],
            numbering_format="FAC-BJ-{YYYY}-{SEQ:6}",
            vat_label="TVA",
        )

    def validate_invoice(self, invoice):
        errors = []
        org = invoice.organization
        if not org.trade_register:
            errors.append("RCCM manquant")
        if not org.tax_id:
            errors.append("IFU manquant")
        return errors
