from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    """
    DRF TokenAuthentication variante qui accepte l'en-tête `Authorization: Bearer <token>`.
    Le frontend emploie ce format par défaut.
    """

    keyword = "Bearer"

