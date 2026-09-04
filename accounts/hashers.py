from django.contrib.auth.hashers import PBKDF2PasswordHasher


class FastPBKDF2PasswordHasher(PBKDF2PasswordHasher):
    """
    A PBKDF2 password hasher with a drastically reduced iteration
    count.

    Django's default PBKDF2 iteration count is intentionally very
    high (several hundred thousand) to resist offline brute-force
    attacks on a leaked database. That cost is a deliberate design
    choice for security-sensitive apps — but on Render's free tier
    (0.1 CPU), it makes every login take multiple seconds.

    This project is a personal bookkeeping tool with no sensitive
    data at stake, so we trade that brute-force resistance for
    speed. Do not reuse this hasher on a project that stores
    sensitive user data.
    """

    iterations = 1000
