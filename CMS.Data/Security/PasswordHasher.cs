using System;
using System.Security.Cryptography;

namespace CMS.Data.Security
{
    public static class PasswordHasher
    {
        /// <summary>
        /// Hashes a password using PBKDF2 (SHA256) with a random salt.
        /// </summary>
        /// <param name="password">The plaintext password.</param>
        /// <returns>A base64 encoded string containing salt and hash.</returns>
        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentNullException(nameof(password));
            }

            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
            {
                byte[] hash = pbkdf2.GetBytes(32);
                byte[] hashBytes = new byte[48];
                Array.Copy(salt, 0, hashBytes, 0, 16);
                Array.Copy(hash, 0, hashBytes, 16, 32);
                return Convert.ToBase64String(hashBytes);
            }
        }

        /// <summary>
        /// Verifies a plaintext password against a hashed password.
        /// </summary>
        /// <param name="password">The plaintext password.</param>
        /// <param name="hashedPassword">The stored hashed password.</param>
        /// <returns>True if the password matches; otherwise, false.</returns>
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hashedPassword))
            {
                return false;
            }

            try
            {
                byte[] hashBytes = Convert.FromBase64String(hashedPassword);
                if (hashBytes.Length != 48)
                {
                    return false;
                }

                byte[] salt = new byte[16];
                Array.Copy(hashBytes, 0, salt, 0, 16);

                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
                {
                    byte[] hash = pbkdf2.GetBytes(32);
                    for (int i = 0; i < 32; i++)
                    {
                        if (hashBytes[i + 16] != hash[i])
                        {
                            return false;
                        }
                    }
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
