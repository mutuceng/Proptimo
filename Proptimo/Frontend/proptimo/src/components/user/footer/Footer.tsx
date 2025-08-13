import React from "react";
import { Box, Link, Typography, Stack, Container } from "@mui/material";
import { useLanguage } from "../../../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  const footerLinks = [
    { label: t('navigation.about'), href: "#" },
    { label: t('navigation.contact'), href: "#" },
    { label: t('footer.privacyPolicy'), href: "#" },
    { label: t('footer.termsOfService'), href: "#" },
  ];

  const socialIcons = [
    {
      label: "Twitter",
      href: "#",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.4A8,8,0,0,0,202.42,98.35Z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: "#",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M256,128C256,57.308,198.692,0,128,0C57.308,0,0,57.308,0,128c0,63.888,46.808,116.843,108,126.445V165H75.5v-37H108V99.8c0-32.08,19.11-49.8,48.348-49.8C170.352,50,185,52.5,185,52.5V84H168.14c-15.312,0-20.14,9.5-20.14,18.9V128h32.5l-5.195,37H148v89.445C209.192,244.843,256,191.888,256,128Z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "#",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24ZM200,176a24,24,0,0,1-24,24H80a24,24,0,0,1-24-24V80A24,24,0,0,1,80,56h96a24,24,0,0,1,24,24ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "#",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,8-8h48a20,20,0,0,0,20-20,8,8,0,0,1,16,0ZM64,88a16,16,0,1,1,16,16A16,16,0,0,1,64,88Z" />
        </svg>
      ),
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1976D2",
        color: "white",
        py: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "flex-start" }}
        >
          {/* Logo ve Açıklama */}
          <Box sx={{ textAlign: { xs: "center", md: "left" }, maxWidth: 300 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Proptimo
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
              {t('footer.description')}
            </Typography>
          </Box>

          {/* Hızlı Linkler */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('footer.quickLinks')}
            </Typography>
            <Stack spacing={1}>
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  color="inherit"
                  underline="hover"
                  sx={{
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Sosyal Medya */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('footer.followUs')}
            </Typography>
            <Stack direction="row" spacing={2}>
              {socialIcons.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  color="inherit"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {social.svg}
                </Link>
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Alt Çizgi */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            mt: 4,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Proptimo. {t('footer.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
