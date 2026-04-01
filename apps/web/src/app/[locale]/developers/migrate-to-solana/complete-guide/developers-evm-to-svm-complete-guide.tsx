"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  CodeBlock,
  ContentEditor,
  Heading,
  Hero,
  HtmlParser,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  BLOCK_STYLES,
  IMAGE_ASSETS,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/complete-guide";

type ImageAsset = (typeof IMAGE_ASSETS)[keyof typeof IMAGE_ASSETS];

export function DevelopersEvmToSvmCompleteGuidePage() {
  const t = useTranslations("developers-evm-to-svm-complete-guide");
  const contentBlocks = t.raw("content.blocks") as string[];
  const tableBlocks = t.raw("tables") as string[];

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
  }));

  const resourceCards = RESOURCE_CARD_DECK.cards.map((card, index) => ({
    ...card,
    heading: t(`resourceCardDeck.cards.${index}.heading`),
    callToAction: {
      ...card.callToAction,
      label: t(`resourceCardDeck.cards.${index}.callToAction.label`),
    },
  }));

  const renderCopyBlock = ({
    index,
    id,
    styleKey,
  }: {
    index: number;
    id?: string;
    styleKey?: keyof typeof BLOCK_STYLES;
  }) => {
    const html = contentBlocks[index];
    const content = (
      <div className="tw-html_parser" id={id}>
        <HtmlParser rawHtml={html} />
      </div>
    );

    if (!styleKey) {
      return content;
    }

    return (
      <ResponsiveBox responsiveStyles={BLOCK_STYLES[styleKey]}>
        {content}
      </ResponsiveBox>
    );
  };

  const renderHtmlBlock = ({
    html,
    styleKey,
  }: {
    html: string;
    styleKey?: keyof typeof BLOCK_STYLES;
  }) => {
    const content = (
      <div className="tw-html_parser">
        <HtmlParser rawHtml={html} />
      </div>
    );

    if (!styleKey) {
      return content;
    }

    return (
      <ResponsiveBox responsiveStyles={BLOCK_STYLES[styleKey]}>
        {content}
      </ResponsiveBox>
    );
  };

  const renderImageBlock = ({
    image,
    styleKey,
  }: {
    image: ImageAsset;
    styleKey?: keyof typeof BLOCK_STYLES;
  }) => {
    const content = (
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        sizes={image.sizes}
        alt={image.alt ?? ""}
        style={{
          width: "100%",
          height: "auto",
          objectFit: image.fit as React.CSSProperties["objectFit"],
        }}
      />
    );

    if (!styleKey) {
      return content;
    }

    return (
      <ResponsiveBox responsiveStyles={BLOCK_STYLES[styleKey]}>
        {content}
      </ResponsiveBox>
    );
  };

  const renderCodeBlock = ({
    code,
    language,
    styleKey,
    id,
  }: {
    code: string;
    language: React.ComponentProps<typeof CodeBlock>["language"];
    styleKey?: keyof typeof BLOCK_STYLES;
    id?: string;
  }) => {
    const content = <CodeBlock code={code} language={language} />;

    if (!styleKey) {
      return <div id={id}>{content}</div>;
    }

    return (
      <ResponsiveBox responsiveStyles={BLOCK_STYLES[styleKey]}>
        <div id={id}>{content}</div>
      </ResponsiveBox>
    );
  };

  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
      />

      <ContentEditor tocHeadline={t("contentEditor.tocHeadline")}>
        <div key="copy-1">
          {renderCopyBlock({ index: 0, styleKey: "spacingWithMargins" })}
        </div>
        <div key="copy-2">
          {renderCopyBlock({
            index: 1,
            id: "account-model",
            styleKey: "spacing",
          })}
        </div>
        <div key="copy-3">
          {renderCopyBlock({
            index: 2,
            id: "types-clients",
            styleKey: "spacing",
          })}
        </div>
        <div key="code-4">
          {renderCodeBlock({
            code: `contract Counter {
  int private count = 0;
  function incrementCounter() public {
    count += 1;
  }
  function getCount() public constant returns (int) {
    return count;
  }
}`,
            language: "solidity",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-5">
          {renderCopyBlock({
            index: 3,
            id: "types-clients",
            styleKey: "spacing",
          })}
        </div>
        <div key="copy-6">
          {renderCopyBlock({ index: 4, styleKey: "smallOnly" })}
        </div>
        <div key="code-7">
          {renderCodeBlock({
            code: `#[program]
pub mod counter_anchor {
  use super::*;
  pub fn initialize_counter(_ctx: Context<InitializeCounter>) -> Result<()> {
    Ok(())
  }
  pub fn increment(ctx: Context<Increment>) -> Result<()> {
    ctx.accounts.counter.count = ctx.accounts.counter.count.checked_add(1).unwrap();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,
  #[account(
    init,
    space = 8 + Counter::INIT_SPACE,
    payer = payer
  )]
  pub counter: Account<'info, Counter>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
  #[account(mut)]
  pub counter: Account<'info, Counter>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
  count: u64,
}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-8">
          {renderCopyBlock({ index: 5, styleKey: "spacing" })}
        </div>
        <div key="image-9">
          {renderImageBlock({
            image: IMAGE_ASSETS.accountModel,
            styleKey: "imageFull",
          })}
        </div>
        <div key="copy-10">
          {renderCopyBlock({ index: 6, id: "benefits", styleKey: "spacing" })}
        </div>
        <div key="image-11">
          {renderImageBlock({
            image: IMAGE_ASSETS.tokenProgram,
            styleKey: "imageFull",
          })}
        </div>
        <div key="copy-12">
          {renderCopyBlock({ index: 7, styleKey: "spacing" })}
        </div>
        <div key="code-13">
          {renderCodeBlock({
            code: "$ spl-token create-token",
            language: "bash",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-14">
          {renderCopyBlock({
            index: 8,
            id: "local-fee-markets",
            styleKey: "spacing",
          })}
        </div>
        <div key="copy-15">
          {renderCopyBlock({
            index: 9,
            id: "fees-solana",
            styleKey: "spacing",
          })}
        </div>
        <div key="copy-16">
          {renderCopyBlock({
            index: 10,
            id: "transactions-solana",
            styleKey: "spacing",
          })}
        </div>
        <div key="copy-17">
          {renderCopyBlock({
            index: 11,
            id: "transaction-limitations",
            styleKey: "spacing",
          })}
        </div>
        <div key="table-18">
          {renderHtmlBlock({ html: tableBlocks[0], styleKey: "tableWrapper" })}
        </div>
        <div key="copy-19">
          {renderCopyBlock({ index: 12, styleKey: "spacing" })}
        </div>
        <div key="copy-20">
          {renderCopyBlock({ index: 13, id: "mempool", styleKey: "spacing" })}
        </div>
        <div key="copy-21">
          {renderCopyBlock({
            index: 14,
            id: "where-smart-contract-code",
            styleKey: "spacing",
          })}
        </div>
        <div key="copy-22">
          {renderCopyBlock({
            index: 15,
            id: "developer-environment",
            styleKey: "spacing",
          })}
        </div>
        <div key="copy-23">
          {renderCopyBlock({ index: 16, id: "languages", styleKey: "spacing" })}
        </div>
        <div key="table-24">
          {renderHtmlBlock({ html: tableBlocks[1], styleKey: "tableWrapper" })}
        </div>
        <div key="copy-25">
          {renderCopyBlock({ index: 17, id: "tools", styleKey: "spacing" })}
        </div>
        <div key="table-26">
          {renderHtmlBlock({ html: tableBlocks[2], styleKey: "tableWrapper" })}
        </div>
        <div key="code-27">
          {renderCopyBlock({
            index: 44,
            id: "differences-smart-contract",
            styleKey: "spacing",
          })}
        </div>
        <div key="code-28">
          {renderCodeBlock({
            code: `mapping(address => uint) public balances;`,
            language: "solidity",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-29">{renderCopyBlock({ index: 18 })}</div>
        <div key="code-30">
          {renderCodeBlock({
            code: `const [BALANCE_PDA] = await anchor.web3.PublicKey.findProgramAddress(
  [Buffer.from("BALANCE"), pg.wallet.publicKey.toBuffer()],
  pg.program.programId
);`,
            language: "typescript",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-31">{renderCopyBlock({ index: 19 })}</div>
        <div key="code-32">
          {renderCodeBlock({
            code: `#[derive(Accounts)]
#[instruction(restaurant: String)]
pub struct BalanceAccounts<'info> {
    #[account(
        init_if_needed,
        payer = signer,
        space = 500,
        seeds = [balance.as_bytes().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub balance: Account<'info, BalanceAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BalanceAccount {
    pub balance: u8
}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-33">
          {renderCopyBlock({ index: 20, styleKey: "spacing" })}
        </div>
        <div key="image-34">
          {renderImageBlock({
            image: IMAGE_ASSETS.upgradeFlow,
            styleKey: "imageMax400",
          })}
        </div>
        <div key="copy-35">
          {renderCopyBlock({ index: 21, styleKey: "spacing" })}
        </div>
        <div key="code-36">
          {renderCodeBlock({
            code: `#[program]
pub mod gettingSigners {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let the_signer: &mut Signer = &mut ctx.accounts.the_signer;

        msg!("The signer: {:?}", *the_signer.key);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub the_signer: Signer<'info>,
}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-37">
          {renderCopyBlock({ index: 22, styleKey: "spacing" })}
        </div>
        <div key="copy-38">
          {renderCodeBlock({
            code: `#[program]
pub mod gettingSigners {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let the_signer: &mut Signer = &mut ctx.accounts.first_signer;

        msg!("The signer: {:?}", *the_signer.key);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub first_signer: Signer<'info>,
    pub second_signer: Signer<'info>,
}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-39">
          {renderCopyBlock({ index: 24, styleKey: "spacing" })}
        </div>
        <div key="copy-40">
          {renderCopyBlock({ index: 25, id: "building", styleKey: "spacing" })}
        </div>
        <div key="copy-41">
          {renderCodeBlock({
            code: `pragma solidity ^0.6.4;

contract Voting {

    mapping (bytes32 => uint256) public votesReceived;

    bytes32[] public candidateList;

    constructor(bytes32[] memory candidateNames) public {
        candidateList = candidateNames;
    }

    function voteForCandidate(bytes32 candidate) public {
        require(validCandidate(candidate));
        votesReceived[candidate] += 1;
    }

    function totalVotesFor(bytes32 candidate) view public returns (uint256) {
        require(validCandidate(candidate));
        return votesReceived[candidate];
    }

    function validCandidate(bytes32 candidate) view public returns (bool) {
        for(uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }
}`,
            language: "solidity",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-42">
          {renderCopyBlock({ index: 27, styleKey: "spacing" })}
        </div>
        <div key="copy-43">
          {renderCodeBlock({
            code: `use anchor_lang::prelude::*;

declare_id!("6voY4gV7kzuGr4hE2xjZnkdagFGNhEe8WonZ8UtdPWig");

#[program]
pub mod voting {
    use super::*;

    pub fn init_candidate(ctx: Context<InitializeCandidate>) -> Result<()> {
        Ok(())
    }

    pub fn vote_for_candidate(ctx: Context<VoteCandidate>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCandidate {}

#[derive(Accounts)]
pub struct VoteCandidate {}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-44">
          {renderCopyBlock({ index: 29, styleKey: "spacing" })}
        </div>
        <div key="copy-45">
          {renderCodeBlock({
            code: `use anchor_lang::prelude::*;

declare_id!("6voY4gV7kzuGr4hE2xjZnkdagFGNhEe8WonZ8UtdPWig");

const OWNER: &str = "8os8PKYmeVjU1mmwHZZNTEv5hpBXi5VvEKGzykduZAik";

#[program]
pub mod voting {
    use super::*;

    #[access_control(check(&ctx))]
    pub fn init_candidate(ctx: Context<InitializeCandidate>) -> Result<()> {
        Ok(())
    }

    pub fn vote_for_candidate(ctx: Context<VoteCandidate>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct VoteCandidate {}

fn check(ctx: &Context<InitializeCandidate>) -> Result<()> {
    // Check if signer === owner
    require_keys_eq!(
        ctx.accounts.payer.key(),
        OWNER.parse::<Pubkey>().unwrap(),
        OnlyOwnerError::NotOwner
    );
    Ok(())
}

#[error_code]
pub enum OnlyOwnerError {
    #[msg("Only owner can call this function!")]
    NotOwner,
}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-46">
          {renderCopyBlock({ index: 31, styleKey: "spacing" })}
        </div>
        <div key="copy-47">
          {renderCodeBlock({
            code: `#[account]
#[derive(InitSpace)]
pub struct Candidate {
    pub votes_received: u8,
}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-48">
          {renderCopyBlock({ index: 33, styleKey: "spacing" })}
        </div>
        <div key="copy-49">
          {renderCodeBlock({
            code: `#[derive(Accounts)]
#[instruction(_candidate_Name: String)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space = 8 + Candidate::INIT_SPACE,
        payer = payer,
        seeds = [_candidate_Name.as_bytes().as_ref()],
        bump,
    )]
    pub candidate: Account<'info, Candidate>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(_candidate_Name: String)]
pub struct VoteCandidate<'info> {
    #[account(
        mut,
        seeds = [_candidate_Name.as_bytes().as_ref()],
        bump,
    )]
    pub candidate: Account<'info, Candidate>,
}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-50">
          {renderCopyBlock({ index: 35, styleKey: "spacing" })}
        </div>
        <div key="copy-51">
          {renderCodeBlock({
            code: `pub fn vote_for_candidate(ctx: Context<VoteCandidate>, _candidate_name: String) -> Result<()> {
    ctx.accounts.candidate.votes_received += 1;
    Ok(())
}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-52">
          {renderCopyBlock({ index: 37, styleKey: "spacing" })}
        </div>
        <div key="copy-53">
          {renderCodeBlock({
            code: `use anchor_lang::prelude::*;

declare_id!("6voY4gV7kzuGr4hE2xjZnkdagFGNhEe8WonZ8UtdPWig");

const OWNER: &str = "8os8PKYmeVjU1mmwHZZNTEv5hpBXi5VvEKGzykduZAik";

#[program]
pub mod voting {
    use super::*;

    #[access_control(check(&ctx))]
    pub fn init_candidate(ctx: Context<InitializeCandidate>, _candidate_name: String) -> Result<()> {
        Ok(())
    }

    pub fn vote_for_candidate(ctx: Context<VoteCandidate>, _candidate_name: String) -> Result<()> {
        ctx.accounts.candidate.votes_received += 1;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_candidate_name: String)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space = 8 + Candidate::INIT_SPACE,
        payer = payer,
        seeds = [_candidate_name.as_bytes().as_ref()],
        bump,
    )]
    pub candidate: Account<'info, Candidate>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(_candidate_name: String)]
pub struct VoteCandidate<'info> {
    #[account(
        mut,
        seeds = [_candidate_name.as_bytes().as_ref()],
        bump,
    )]
    pub candidate: Account<'info, Candidate>,
}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
    pub votes_received: u8,
}

fn check(ctx: &Context<InitializeCandidate>) -> Result<()> {
    // Check if signer === owner
    require_keys_eq!(
        ctx.accounts.payer.key(),
        OWNER.parse::<Pubkey>().unwrap(),
        OnlyOwnerError::NotOwner
    );
    Ok(())
}

#[error_code]
pub enum OnlyOwnerError {
    #[msg("Only owner can call this function!")]
    NotOwner,
}`,
            language: "rust",
            styleKey: "codeBlock",
          })}
        </div>
        <div key="copy-54">
          {renderCopyBlock({ index: 39, styleKey: "spacing" })}
        </div>
        <div key="image-55">
          {renderImageBlock({
            image: IMAGE_ASSETS.playgroundInit,
            styleKey: "imageMax500",
          })}
        </div>
        <div key="copy-56">
          {renderCopyBlock({ index: 40, styleKey: "spacing" })}
        </div>
        <div key="image-57">
          {renderImageBlock({
            image: IMAGE_ASSETS.playgroundLogs,
            styleKey: "imageMax700",
          })}
        </div>
        <div key="copy-58">
          {renderCopyBlock({ index: 41, styleKey: "spacing" })}
        </div>
        <div key="image-59">
          {renderImageBlock({
            image: IMAGE_ASSETS.playgroundVote,
            styleKey: "imageMax700",
          })}
        </div>
        <div key="copy-60">
          {renderCopyBlock({ index: 42, styleKey: "spacing" })}
        </div>
        <div key="image-61">
          {renderImageBlock({
            image: IMAGE_ASSETS.playgroundResults,
            styleKey: "imageMax500",
          })}
        </div>
        <div key="copy-62">
          {renderCopyBlock({ index: 43, styleKey: "spacing" })}
        </div>
      </ContentEditor>

      <Heading
        variant="centered"
        eyebrow={t("navHeading.eyebrow")}
        headline=""
        body=""
        buttons={navButtons as React.ComponentProps<typeof Heading>["buttons"]}
      />

      <Heading eyebrow="" headline={t("resourceHeading.headline")} body="" />

      <ResponsiveBox responsiveStyles={BLOCK_STYLES.cardDeckWrapper}>
        <CardDeck
          cards={
            resourceCards as React.ComponentProps<typeof CardDeck>["cards"]
          }
          numCols={
            RESOURCE_CARD_DECK.numCols as React.ComponentProps<
              typeof CardDeck
            >["numCols"]
          }
          featured={RESOURCE_CARD_DECK.featured}
        />
      </ResponsiveBox>
    </>
  );
}
