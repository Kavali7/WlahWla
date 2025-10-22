from .uemoa import UEMOAAdapter, UEMOA
from .benin import BeninAdapter


def adapter_for(org):
    if org.country_code == "BJ":
        return BeninAdapter()
    if org.country_code in UEMOA:
        return UEMOAAdapter()
    return UEMOAAdapter()
