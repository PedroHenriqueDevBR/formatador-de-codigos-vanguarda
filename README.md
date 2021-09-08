# Extract Code

Sistema desenvolvido durante o estágio no Grupo Vanguarda e foi desenvolvido para solucionar 
um problema interno da empresa.

<img width="100%" src="https://github.com/PedroHenriqueDevBR/extract-code-vanguarda/blob/main/docs/print-01.png?raw=true">

## Motivação da solução

O objetivo dessa aplicação é acelerar a extração de códigos de produtos recebidos por e-mail.

Durante o expediente muitos e-mails eram recebidos contendo informações que precisavam ser 
repassadas de um sistema para outros, como uma forma manual de alimentar informações, esse 
é um processo interno e que precisava ser automatizado pois para cada linha de informação 
que era recebida aumentava o tempo de digitação e a possibilidade de digitar algo incorreto
e isso gera problemas no futuro.

## Exeplo da utilização

Um exemplo de código recebido abaixo, temos 3 informações principais, a primeira delas é o 
código do produto (que é o que interessa para nós), a segunda é o nome e a terceira 
é o preço.

```
# Entrada

0001  Produto 01   R$ 12,00
0002  Produto 02   R$ 2,00
0003  Produto 03   R$ 20,00
0004  Produto 04   R$ 21,00
0005  Produto 05   R$ 14,00
0006  Produto 06   R$ 156,00
0007  Produto 07   R$ 835,00
2359  Produto 08   R$ 15,00
9274  Produto 09   R$ 62,00
149129  Produto 10   R$ 112,00

# Saída

0001,0002,0003,0004,0005,0006,0007,2359,9274,149129
```

